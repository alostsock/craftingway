import { autorun, reaction } from "mobx";
import React, { useEffect } from "react";

export function useAutorun(fn: () => void, reactDeps: React.DependencyList = []) {
  useEffect(() => {
    const disposer = autorun(fn);
    return () => disposer();
  }, reactDeps);
}

export function useReaction<T>(dataFn: () => T, effectFn: (data: T) => void) {
  useEffect(() => {
    const disposer = reaction(dataFn, effectFn);
    return () => disposer();
  }, []);
}
