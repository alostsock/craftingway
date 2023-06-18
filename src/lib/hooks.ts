import { autorun, reaction } from "mobx";
import React, { useEffect } from "react";

export function useAutorun(fn: () => void, reactDeps: React.DependencyList = []) {
  useEffect(() => {
    const disposer = autorun(fn);
    return () => disposer();
  }, reactDeps); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useReaction<T>(dataFn: () => T, effectFn: (data: T) => void) {
  useEffect(() => {
    const disposer = reaction(dataFn, effectFn);
    return () => disposer();
  }, [dataFn, effectFn]);
}
