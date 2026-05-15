import { RedirectToSignIn, SignedIn, UserButton } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { data } = authClient.useSession();

	return (
		<>
			<SignedIn>
				<div className="flex flex-col justify-center items-center min-h-screen gap-8 p-8">
					<div className="text-center">
						<h1 className="text-4xl font-bold">Welcome!</h1>
						<p className="mt-4 text-lg">You're successfully authenticated.</p>
						<div className="mt-4 flex justify-center">
							<UserButton />
						</div>
						<p className="font-medium text-gray-700 dark:text-gray-200 mt-4">
							Session and User Data:
						</p>
						<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-words w-full max-w-full sm:max-w-2xl mx-auto text-left mt-2">
							<code>
								{JSON.stringify(
									{ session: data?.session, user: data?.user },
									null,
									2,
								)}
							</code>
						</pre>
					</div>
				</div>
			</SignedIn>
			<RedirectToSignIn />
		</>
	);
}
