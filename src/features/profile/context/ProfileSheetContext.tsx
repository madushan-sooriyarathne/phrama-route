import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type ProfileSheetContextValue = {
	open: boolean;
	openSheet: () => void;
	closeSheet: () => void;
};

const ProfileSheetContext = createContext<ProfileSheetContextValue | null>(
	null,
);

export function ProfileSheetProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const openSheet = useCallback(() => setOpen(true), []);
	const closeSheet = useCallback(() => setOpen(false), []);

	const value = useMemo(
		() => ({ open, openSheet, closeSheet }),
		[open, openSheet, closeSheet],
	);

	return (
		<ProfileSheetContext.Provider value={value}>
			{children}
		</ProfileSheetContext.Provider>
	);
}

export function useProfileSheet(): ProfileSheetContextValue {
	const ctx = useContext(ProfileSheetContext);
	if (!ctx) {
		throw new Error(
			"useProfileSheet must be used within a ProfileSheetProvider",
		);
	}
	return ctx;
}
