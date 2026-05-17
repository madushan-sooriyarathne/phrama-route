import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTRPC } from "#/integrations/trpc/react";
import { authClient } from "#/lib/auth-client";
import { isSuperAdmin, type UserRole } from "#/lib/role";
import { AdminHeader } from "../../components/AdminHeader";
import { UserFormDialog, type UserFormMode } from "./UserFormDialog";
import { UserRow } from "./UserRow";

export function UsersScreen() {
	const trpc = useTRPC();
	const qc = useQueryClient();
	const { data: session } = authClient.useSession();
	const currentRole = (session?.user as { role?: UserRole } | undefined)?.role;
	const canAssignSuperAdmin = isSuperAdmin(currentRole);

	const usersQuery = useQuery(trpc.admin.listUsers.queryOptions());

	const [formMode, setFormMode] = useState<UserFormMode | null>(null);
	const [error, setError] = useState<string | null>(null);

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: trpc.admin.listUsers.queryKey() });

	const createMut = useMutation(
		trpc.admin.createUser.mutationOptions({
			onSuccess: () => {
				setFormMode(null);
				setError(null);
				invalidate();
			},
			onError: (e) => setError(e.message),
		}),
	);

	const updateMut = useMutation(
		trpc.admin.updateUser.mutationOptions({
			onSuccess: () => {
				setFormMode(null);
				setError(null);
				invalidate();
			},
			onError: (e) => setError(e.message),
		}),
	);

	const deleteMut = useMutation(
		trpc.admin.deleteUser.mutationOptions({
			onSuccess: () => invalidate(),
		}),
	);

	const handleSubmit = (data: {
		name: string;
		email: string;
		password?: string;
		role: UserRole;
	}) => {
		if (!formMode) return;
		if (formMode.kind === "create") {
			if (!data.password) {
				setError("Password is required.");
				return;
			}
			createMut.mutate({
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role,
			});
		} else {
			updateMut.mutate({
				id: formMode.user.id,
				name: data.name,
				role: data.role,
			});
		}
	};

	const handleDelete = (userId: string, name: string) => {
		if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
		deleteMut.mutate({ id: userId });
	};

	return (
		<div className="flex h-dvh flex-col bg-canvas">
			<AdminHeader
				title="Users"
				actionLabel="Add user"
				onAction={() => {
					setError(null);
					setFormMode({ kind: "create" });
				}}
			/>

			<main className="flex flex-1 flex-col overflow-y-auto">
				{usersQuery.isPending ? (
					<div className="flex flex-col gap-2 p-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-14 animate-pulse rounded-md bg-surface-soft"
							/>
						))}
					</div>
				) : usersQuery.isError ? (
					<div className="px-4 py-8">
						<p className="font-sans text-body-md text-error">
							Failed to load users.
						</p>
					</div>
				) : usersQuery.data.length === 0 ? (
					<div className="px-4 py-16 text-center">
						<p className="font-sans text-body-md text-muted">No users yet.</p>
					</div>
				) : (
					<ul className="flex flex-col divide-y divide-hairline">
						{usersQuery.data.map((u) => (
							<UserRow
								key={u.id}
								user={u}
								canDelete={u.id !== session?.user?.id}
								onEdit={() => {
									setError(null);
									setFormMode({
										kind: "edit",
										user: {
											id: u.id,
											name: u.name,
											email: u.email,
											role: u.role,
										},
									});
								}}
								onDelete={() => handleDelete(u.id, u.name)}
							/>
						))}
					</ul>
				)}
			</main>

			{formMode ? (
				<UserFormDialog
					mode={formMode}
					canAssignSuperAdmin={canAssignSuperAdmin}
					isSubmitting={createMut.isPending || updateMut.isPending}
					error={error}
					onSubmit={handleSubmit}
					onCancel={() => {
						setFormMode(null);
						setError(null);
					}}
				/>
			) : null}
		</div>
	);
}
