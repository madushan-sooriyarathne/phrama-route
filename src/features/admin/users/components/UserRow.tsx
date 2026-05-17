import { Pencil, Trash2 } from "lucide-react";
import { RolePill } from "../../components/RolePill";

interface UserRowProps {
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
		image: string | null;
	};
	canDelete: boolean;
	onEdit: () => void;
	onDelete: () => void;
}

function getInitial(name: string): string {
	return name.trim().charAt(0).toUpperCase() || "U";
}

export function UserRow({ user, canDelete, onEdit, onDelete }: UserRowProps) {
	return (
		<li className="flex items-center gap-3 px-[16px] py-[12px]">
			{user.image ? (
				<img
					src={user.image}
					alt=""
					className="h-10 w-10 rounded-full object-cover"
				/>
			) : (
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-strong">
					<span className="font-sans text-body-md font-semibold text-ink">
						{getInitial(user.name)}
					</span>
				</div>
			)}
			<div className="flex flex-1 flex-col">
				<span className="font-sans text-label-md font-medium text-ink">
					{user.name}
				</span>
				<span className="font-sans text-body-md text-muted">{user.email}</span>
			</div>
			<RolePill role={user.role} />
			<button
				type="button"
				aria-label={`Edit ${user.name}`}
				onClick={onEdit}
				className="flex h-9 w-9 items-center justify-center text-muted active:text-ink"
			>
				<Pencil size={18} strokeWidth={1.5} />
			</button>
			{canDelete ? (
				<button
					type="button"
					aria-label={`Delete ${user.name}`}
					onClick={onDelete}
					className="flex h-9 w-9 items-center justify-center text-muted active:text-error"
				>
					<Trash2 size={18} strokeWidth={1.5} />
				</button>
			) : null}
		</li>
	);
}
