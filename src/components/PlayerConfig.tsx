import "./PlayerConfig.scss";

import clsx from "clsx";
import { useCombobox } from "downshift";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import Emoji from "./Emoji";
import NumberInput from "./NumberInput";
import { Job, JOBS, JOB_EMOJIS } from "../lib/jobs";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";
import {
  ConsumableVariant,
  FOOD_VARIANTS,
  POTION_VARIANTS,
  searchConsumables,
} from "../lib/consumables";
import { useAutorun } from "../lib/hooks";

type StatConfig = {
  name: string;
  label: string;
  min: number;
  max: number;
};

const STATS = [
  { name: "job_level", label: "Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 9000 },
  { name: "control", label: "Control", min: 0, max: 9000 },
  { name: "cp", label: "CP", min: 180, max: 1000 },
] as const satisfies readonly StatConfig[];

const PlayerConfig = observer(function PlayerConfig() {
  type CopyMenuState = "inactive" | "copying" | "copying-all";
  const [copyMenuState, setCopyMenuState] = useState<CopyMenuState>("inactive");

  const handleJobChange = action((event: React.ChangeEvent<HTMLInputElement>) => {
    PlayerState.job = event.target.value as Job;
    RecipeState.recipe = null;
    setCopyMenuState("inactive");
  });

  const handleConfigCopy = action((job: Job) => {
    const config = PlayerState.configByJob[job];
    PlayerState.setConfig(config);
    setCopyMenuState("inactive");
  });

  const handleConfigCopyAll = action(() => {
    const config = PlayerState.config;
    PlayerState.setConfigForAllJobs(config);
    setCopyMenuState("inactive");
  });

  return (
    <section className="PlayerConfig">
      <fieldset className="jobs">
        {JOBS.map((job) => {
          const id = `radio-${job}`;

          return (
            <React.Fragment key={job}>
              <input
                id={id}
                className="visually-hidden"
                type="radio"
                name="job"
                checked={PlayerState.job === job}
                value={job}
                onChange={handleJobChange}
                autoComplete="off"
              />
              <label htmlFor={id} tabIndex={-1}>
                <Emoji emoji={JOB_EMOJIS[job]} />
                {job}
              </label>
            </React.Fragment>
          );
        })}
      </fieldset>

      <div className="configs">
        <div className="stats">
          {STATS.map(({ name, label, min, max }) => {
            const id = `input-${name}`;

            return (
              <div className="field" key={name}>
                <label htmlFor={id}>{label}</label>
                <NumberInput
                  id={id}
                  key={name}
                  min={min}
                  max={max}
                  numberValue={PlayerState.config[name]}
                  onNumberChange={(value) => PlayerState.setConfig({ [name]: value })}
                />
                {name !== "job_level" && (
                  <div className="bonuses">
                    {PlayerState.foodBonus[name] > 0 && (
                      <span className="food">+{PlayerState.foodBonus[name]}</span>
                    )}
                    {PlayerState.potionBonus[name] > 0 && (
                      <span className="potion">+{PlayerState.potionBonus[name]}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="consumables">
          <FoodSelect />
          <PotionSelect />
        </div>
      </div>

      <div className="prompts">
        {copyMenuState !== "copying-all" ? (
          <button className="link" onClick={() => setCopyMenuState("copying-all")}>
            Copy stats <strong>to</strong> all other jobs
          </button>
        ) : (
          <div>
            Copying {PlayerState.job} stats to all other jobs… Are you sure?{" "}
            <button className="link" onClick={handleConfigCopyAll}>
              OK
            </button>{" "}
            <button className="link" onClick={() => setCopyMenuState("inactive")}>
              Cancel
            </button>
          </div>
        )}

        {copyMenuState !== "copying" ? (
          <button className="link" onClick={() => setCopyMenuState("copying")}>
            Copy stats <strong>from</strong> another job
          </button>
        ) : (
          <div>
            Copy stats from…
            {JOBS.map((job) => (
              <React.Fragment key={job}>
                {" "}
                <button key={job} className="link" onClick={() => handleConfigCopy(job)}>
                  {job}
                </button>
              </React.Fragment>
            ))}{" "}
            <button className="link" onClick={() => setCopyMenuState("inactive")}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

export default PlayerConfig;

const FoodSelect = observer(function FoodSelect() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<ConsumableVariant[]>(FOOD_VARIANTS.slice());

  const setFood = action((food: ConsumableVariant | null) => PlayerState.setConfig({ food }));
  const cb = useCombobox({
    defaultInputValue: query,
    onInputValueChange: ({ inputValue }) => setQuery(inputValue || ""),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setFood(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  useAutorun(() => {
    setQueryResults(searchConsumables(FOOD_VARIANTS, query));
  }, [query]);

  return (
    <React.Fragment>
      <label className={clsx({ "food-active": PlayerState.config.food })} {...cb.getLabelProps()}>
        Food
      </label>

      <div className="dropdown-list" {...cb.getComboboxProps()}>
        <input
          className={clsx("trigger", { placeholder: !PlayerState.config.food })}
          placeholder="No food"
          spellCheck="false"
          onFocus={() => cb.openMenu()}
          {...cb.getInputProps()}
        />

        <ul {...cb.getMenuProps()}>
          {cb.isOpen &&
            queryResults.map((item, index) => (
              <li key={index} {...cb.getItemProps({ item, index })}>
                <ConsumableVariantDisplay variant={item} />
              </li>
            ))}
        </ul>

        {PlayerState.config.food && (
          <button
            className="link reset"
            onClick={() => {
              setFood(null);
              cb.reset();
            }}
          >
            <Emoji emoji="❌" />
          </button>
        )}
      </div>
    </React.Fragment>
  );
});

const PotionSelect = observer(function PotionSelect() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<ConsumableVariant[]>(POTION_VARIANTS.slice());

  const setPotion = action((potion: ConsumableVariant | null) => PlayerState.setConfig({ potion }));
  const cb = useCombobox({
    defaultInputValue: query,
    onInputValueChange: ({ inputValue }) => setQuery(inputValue || ""),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setPotion(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  useAutorun(() => {
    setQueryResults(searchConsumables(POTION_VARIANTS, query));
  }, [query]);

  return (
    <React.Fragment>
      <label
        className={clsx({ "potion-active": PlayerState.config.potion })}
        {...cb.getLabelProps()}
      >
        Potion
      </label>

      <div className="dropdown-list" {...cb.getComboboxProps()}>
        <input
          className={clsx("trigger", { placeholder: !PlayerState.config.potion })}
          placeholder="No potion"
          spellCheck="false"
          onFocus={() => cb.openMenu()}
          {...cb.getInputProps()}
        />

        <ul {...cb.getMenuProps()}>
          {cb.isOpen &&
            queryResults.map((item, index) => (
              <li key={index} {...cb.getItemProps({ item, index })}>
                <ConsumableVariantDisplay variant={item} />
              </li>
            ))}
        </ul>

        {PlayerState.config.potion && (
          <button
            className="link reset"
            onClick={() => {
              setPotion(null);
              cb.reset();
            }}
          >
            <Emoji emoji="❌" />
          </button>
        )}
      </div>
    </React.Fragment>
  );
});

const ConsumableVariantDisplay = observer(function ConsumableVariantDisplay({
  variant: { name, craftsmanship, control, cp },
}: {
  variant: ConsumableVariant;
}) {
  return (
    <React.Fragment>
      <div className="name">{name}</div>
      <div className="details">
        {craftsmanship && (
          <div>
            Crafts. +{craftsmanship[0]}% (Max {craftsmanship[1]})
          </div>
        )}
        {control && (
          <div>
            Control +{control[0]}% (Max {control[1]})
          </div>
        )}
        {cp && (
          <div>
            CP +{cp[0]}% (Max {cp[1]})
          </div>
        )}
      </div>
    </React.Fragment>
  );
});
