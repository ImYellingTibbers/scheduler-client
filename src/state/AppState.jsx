import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadState, saveState } from '../lib/storage.js';
import { makeId } from '../lib/id.js';

const AppState = createContext(null);

const initialData = {
  users: [],              // { _id, name, employeeId, qualifications:{OR,Fluoro,Dexa}, availabilityTemplate:{mon..sun:[24] "green|yellow|red"}, overrides:[{date,status}] }
  sites: [                // default sites
    { _id: 'general', name: 'General' },
    { _id: 'or', name: 'OR' },
    { _id: 'fluoro', name: 'Fluoro' },
    { _id: 'dexa', name: 'Dexa' },
  ],
  coverage: [],           // { _id, date:'YYYY-MM-DD', siteId, requiredCount }
  shifts: [],             // { _id, userId, siteId, start, end, status }
  holidays: [],           // from API (already loaded in App)
  timezone: 'America/Denver',
};

function normalizeTemplate() {
  const blank = Array(24).fill('red'); // default “cannot”; change if you prefer
  return { mon:[...blank], tue:[...blank], wed:[...blank], thu:[...blank], fri:[...blank], sat:[...blank], sun:[...blank] };
}

export function AppStateProvider({ children, holidaysFromApi = [] }) {
  const saved = loadState();
  const [state, setState] = useState(saved ?? { ...initialData, holidays: holidaysFromApi });

  // keep holidays refreshed from API once
  useEffect(() => {
    if (holidaysFromApi?.length) {
      setState((s) => ({ ...s, holidays: holidaysFromApi }));
    }
  }, [holidaysFromApi]);

  // persist
  useEffect(() => saveState(state), [state]);

  // actions
  const actions = useMemo(() => ({
    addUser(user) {
      setState((s) => ({
        ...s,
        users: [...s.users, {
          _id: makeId('usr'),
          name: user.name.trim(),
          employeeId: user.employeeId?.trim() || '',
          qualifications: { OR: !!user.qualOR, Fluoro: !!user.qualFluoro, Dexa: !!user.qualDexa },
          availabilityTemplate: normalizeTemplate(),
          overrides: [],
        }],
      }));
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
      setState((s) => ({ ...s, sites: [...s.sites, { _id: makeId('site'), name: trimmed }] }));
    },
    deleteSite(id) {
      // keep “General” safe if you want—skip deletion for id==='general'
      setState((s) => ({
        ...s,
        sites: s.sites.filter((st) => st._id !== id),
        coverage: s.coverage.filter((c) => c.siteId !== id),
        shifts: s.shifts.filter((sh) => sh.siteId !== id),
      }));
    },

    setAvailabilityCell(userId, day, hour, nextState) {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => {
          if (u._id !== userId) return u;
          const copy = { ...u, availabilityTemplate: { ...u.availabilityTemplate } };
          const arr = [...(copy.availabilityTemplate[day] ?? [])];
          arr[hour] = nextState;
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
        const existing = s.coverage.find((c) => c.date === date && c.siteId === siteId);
        if (existing) {
          return {
            ...s,
            coverage: s.coverage.map((c) => (c === existing ? { ...c, requiredCount } : c)),
          };
        }
        return { ...s, coverage: [...s.coverage, { _id: makeId('cov'), date, siteId, requiredCount }] };
      });
    },
  }), []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppState);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
