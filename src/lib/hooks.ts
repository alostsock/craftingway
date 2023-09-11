import { autorun, reaction } from "mobx";
import React, { useEffect } from "react";

export function useAutorun(fn: () => void, reactDeps: React.DependencyList = []) {
  useEffect(
    () => autorun(fn),
    reactDeps // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export function useReaction<T>(dataFn: () => T, effectFn: (data: T) => void) {
  useEffect(() => reaction(dataFn, effectFn), [dataFn, effectFn]);
}
