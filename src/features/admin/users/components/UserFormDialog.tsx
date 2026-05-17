import { useEffect, useState } from "react";
import { USER_ROLES, type UserRole } from "#/lib/role";

export type UserFormMode =
	| { kind: "create" }
	| {
			kind: "edit";
			user: {
				id: string;
				name: string;
				email: string;
				role: UserRole | string;
			};
	  };

interface UserFormDialogProps {
	mode: UserFormMode;
	canAssignSuperAdmin: boolean;
	isSubmitting: boolean;
	error: string | null;
	onSubmit: (data: {
		name: string;
		email: string;
		password?: string;
		role: UserRole;
	}) => void;
	onCancel: () => void;
}

export function UserFormDialog({
	mode,
	canAssignSuperAdmin,
	isSubmitting,
	error,
	onSubmit,
	onCancel,
}: UserFormDialogProps) {
	const isEdit = mode.kind === "edit";
	const [name, setName] = useState(isEdit ? mode.user.name : "");
	const [email, setEmail] = useState(isEdit ? mode.user.email : "");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<UserRole>(
		isEdit ? ((mode.user.role as UserRole) ?? "rep") : "rep",
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onCancel]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			name: name.trim(),
			email: email.trim(),
			password: isEdit ? undefined : password,
			role,
		});
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="user-form-title"
			className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center"
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onCancel();
			}}
		>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md rounded-t-[16px] bg-canvas px-[16px] pb-[24px] pt-[24px] sm:rounded-[16px]"
			>
				<div className="mb-[4px] h-1 w-10 rounded-full bg-hairline mx-auto sm:hidden" />
				<h2
					id="user-form-title"
					className="mt-[12px] font-sans text-title-lg font-semibold text-ink"
				>
					{isEdit ? "Edit user" : "Add user"}
				</h2>

				<div className="mt-[24px] flex flex-col gap-[16px]">
					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Name
						</span>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
						/>
					</label>

					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Email
						</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isEdit}
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink disabled:bg-surface-soft disabled:text-muted"
						/>
					</label>

					{!isEdit ? (
						<label className="flex flex-col gap-1">
							<span className="font-sans text-body-md font-medium text-ink">
								Password
							</span>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={8}
								className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
							/>
						</label>
					) : null}

					<label className="flex flex-col gap-1">
						<span className="font-sans text-body-md font-medium text-ink">
							Role
						</span>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value as UserRole)}
							className="h-[44px] rounded-md border border-hairline bg-canvas px-3 font-sans text-label-md text-ink"
						>
							{USER_ROLES.map((r) => {
								if (r === "super_admin" && !canAssignSuperAdmin) return null;
								return (
									<option key={r} value={r}>
										{r.replace("_", " ")}
									</option>
								);
							})}
						</select>
					</label>

					{error ? (
						<p className="font-sans text-body-md text-error">{error}</p>
					) : null}
				</div>

				<div className="mt-[24px] flex flex-col gap-[12px]">
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-[48px] w-full items-center justify-center rounded-lg bg-primary font-sans text-button font-medium text-on-primary disabled:opacity-60"
					>
						{isSubmitting
							? "Saving..."
							: isEdit
								? "Save changes"
								: "Create user"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex h-[48px] w-full items-center justify-center rounded-lg border border-hairline bg-canvas font-sans text-button font-medium text-ink active:bg-surface-soft"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
