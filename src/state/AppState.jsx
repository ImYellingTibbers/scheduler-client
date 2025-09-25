import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addMinutes } from "date-fns";
import { loadState, saveState } from "../lib/storage.js";
import { makeId } from "../lib/id.js";
import { ymd, dayKey } from "../lib/time.js";

const AppState = createContext(null);

export function availabilityAt(user, dateObj) {
  const d = ymd(dateObj);
  const override = (user.overrides || []).find((o) => o.date === d);
  if (override) return override.status;

  const day = dayKey(dateObj);
  const h = dateObj.getHours();
  const m = dateObj.getMinutes();
  const slot = h * 2 + (m >= 30 ? 1 : 0);
  return user.availabilityTemplate?.[day]?.[slot] || "red";
}

export function availabilityForSpan(user, startISO, hours) {
  const seen = new Set();
  let cur = new Date(startISO);
  const steps = Math.max(1, Math.round((hours || 0) * 2));
  for (let i = 0; i < steps; i += 1) {
    seen.add(availabilityAt(user, cur));
    cur = addMinutes(cur, 30);
  }
  return seen;
}

const initialData = {
  users: [], // {_id,name,employeeId,qualifications:{OR,Fluoro,Dexa}, availabilityTemplate:{mon..sun:[48]}, overrides:[{date,status}]}
  sites: [
    { _id: "general", name: "General" },
    { _id: "or", name: "OR" },
    { _id: "fluoro", name: "Fluoro" },
    { _id: "dexa", name: "Dexa" },
  ],
  coverage: [], // {_id,date:'YYYY-MM-DD',siteId,requiredCount}
  shifts: [], // {_id,userId,siteId,start,end,status}
  holidays: [], // from API
  timezone: "America/Denver",
  coverageDefaults: { general: 1, or: 2, fluoro: 3, dexa: 4 },
};

function normalizeTemplate() {
  const blank = Array(48).fill("yellow");
  return {
    mon: [...blank],
    tue: [...blank],
    wed: [...blank],
    thu: [...blank],
    fri: [...blank],
    sat: [...blank],
    sun: [...blank],
  };
}

export function AppStateProvider({ children, holidaysFromApi = [] }) {
  const saved = loadState();
  const [state, setState] = useState(
    saved ?? { ...initialData, holidays: holidaysFromApi }
  );

  useEffect(() => {
    // ensure core sites exist with their canonical IDs
    setState((s) => {
      const core = [
        { _id: "general", name: "General" },
        { _id: "or", name: "OR" },
        { _id: "fluoro", name: "Fluoro" },
        { _id: "dexa", name: "Dexa" },
      ];
      let changed = false;
      let sites = s.sites || [];
      for (const c of core) {
        if (!sites.some((x) => x._id === c._id)) {
          sites = [...sites, c];
          changed = true;
        }
      }
      return changed ? { ...s, sites } : s;
    });
  }, []);

  useEffect(() => {
    setState((s) => {
      if (!s?.users?.length) return s;
      let changed = false;
      const users = s.users.map((u) => {
        const tpl = u.availabilityTemplate || {};
        const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        let updated = false;
        const out = {};
        for (const d of days) {
          const arr = tpl[d];
          if (Array.isArray(arr) && arr.length === 24) {
            const doubled = [];
            for (let i = 0; i < 24; i += 1) {
              const v = arr[i] ?? "red";
              doubled.push(v, v);
            }
            out[d] = doubled;
            updated = true;
          } else if (Array.isArray(arr)) {
            out[d] = arr;
          }
        }
        if (updated) {
          changed = true;
          return { ...u, availabilityTemplate: { ...tpl, ...out } };
        }
        return u;
      });
      return changed ? { ...s, users } : s;
    });
  }, []);

  useEffect(() => {
    if (holidaysFromApi?.length) {
      setState((s) => ({ ...s, holidays: holidaysFromApi }));
    }
  }, [holidaysFromApi]);

  useEffect(() => saveState(state), [state]);

  const actions = useMemo(
    () => ({
      addUser(user) {
        // Ensure provided template is 48-slot (handles any legacy 24-slot objects)
        function to48(tpl) {
          if (!tpl) return null;
          const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
          let changed = false;
          const out = {};
          for (const d of days) {
            const arr = tpl[d];
            if (Array.isArray(arr) && arr.length === 24) {
              const doubled = [];
              for (let i = 0; i < 24; i += 1) {
                const v = arr[i] ?? "red";
                doubled.push(v, v);
              }
              out[d] = doubled;
              changed = true;
            } else if (Array.isArray(arr)) {
              out[d] = arr;
            }
          }
          return changed ? { ...tpl, ...out } : tpl;
        }

        const incomingTpl = user.availabilityTemplate || normalizeTemplate();
        const tpl48 = to48(incomingTpl) || normalizeTemplate();

        setState((s) => ({
          ...s,
          users: [
            ...s.users,
            {
              _id: makeId("usr"),
              name: user.name.trim(),
              employeeId: user.employeeId?.trim() || "",
              qualifications: {
                OR: !!user.qualOR,
                Fluoro: !!user.qualFluoro,
                Dexa: !!user.qualDexa,
              },
              availabilityTemplate: tpl48,
              overrides: [],
            },
          ],
        }));
      },

      setCoverageDefault(siteId, requiredCount) {
        setState((s) => ({
          ...s,
          coverageDefaults: {
            ...s.coverageDefaults,
            [siteId]: Number(requiredCount) || 0,
          },
        }));
      },

      setCoverageForDates(dates, siteId, requiredCount) {
        setState((s) => {
          const next = [...s.coverage];
          for (const d of dates) {
            const i = next.findIndex(
              (c) => c.date === d && c.siteId === siteId
            );
            if (i >= 0) {
              next[i] = {
                ...next[i],
                requiredCount: Number(requiredCount) || 0,
              };
            } else {
              next.push({
                _id: makeId("cov"),
                date: d,
                siteId,
                requiredCount: Number(requiredCount) || 0,
              });
            }
          }
          return { ...s, coverage: next };
        });
      },

      updateUser(id, patch) {
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u._id === id ? { ...u, ...patch } : u)),
        }));
      },

      deleteUser(id) {
        setState((s) => ({
          ...s,
          users: s.users.filter((u) => u._id !== id),
          shifts: s.shifts.filter((sh) => sh.userId !== id),
        }));
      },

      addSite(name) {
        const trimmed = name.trim();
        if (!trimmed) return;
        setState((s) => ({
          ...s,
          sites: [...s.sites, { _id: makeId("site"), name: trimmed }],
        }));
      },

      deleteSite(id) {
        setState((s) => ({
          ...s,
          sites: s.sites.filter((st) => st._id !== id),
          coverage: s.coverage.filter((c) => c.siteId !== id),
          shifts: s.shifts.filter((sh) => sh.siteId !== id),
        }));
      },

      addShift({ userId, siteId, startISO, endISO }) {
        setState((s) => ({
          ...s,
          shifts: [
            ...s.shifts,
            {
              _id: makeId("shf"),
              userId,
              siteId,
              start: startISO,
              end: endISO,
              status: "assigned",
            },
          ],
        }));
      },

      updateShift(id, patch) {
        setState((s) => ({
          ...s,
          shifts: s.shifts.map((sh) =>
            sh._id === id ? { ...sh, ...patch } : sh
          ),
        }));
      },

      deleteShift(id) {
        setState((s) => ({
          ...s,
          shifts: s.shifts.filter((sh) => sh._id !== id),
        }));
      },

      setAvailabilityCell(userId, day, slot, nextState) {
        setState((s) => ({
          ...s,
          users: s.users.map((u) => {
            if (u._id !== userId) return u;
            const copy = {
              ...u,
              availabilityTemplate: { ...u.availabilityTemplate },
            };
            const arr = [...(copy.availabilityTemplate[day] ?? [])];
            arr[slot] = nextState;
            copy.availabilityTemplate[day] = arr;
            return copy;
          }),
        }));
      },

      setOverride(userId, date, status) {
        setState((s) => ({
          ...s,
          users: s.users.map((u) => {
            if (u._id !== userId) return u;
            const others = (u.overrides ?? []).filter((o) => o.date !== date);
            return { ...u, overrides: [...others, { date, status }] };
          }),
        }));
      },

      setCoverage(date, siteId, requiredCount) {
        setState((s) => {
          const existing = s.coverage.find(
            (c) => c.date === date && c.siteId === siteId
          );
          if (existing) {
            return {
              ...s,
              coverage: s.coverage.map((c) =>
                c === existing ? { ...c, requiredCount } : c
              ),
            };
          }
          return {
            ...s,
            coverage: [
              ...s.coverage,
              { _id: makeId("cov"), date, siteId, requiredCount },
            ],
          };
        });
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppState);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
