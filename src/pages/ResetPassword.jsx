import { useState } from "react";
import { useParams } from "react-router-dom";


export default function ResetPassword() {
    const { uid, token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const res = await fetch(
                "http://127.0.0.1:8000/api-auth-djoser/users/reset_password_confirm/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uid: uid,
                        token: token,
                        new_password: newPassword,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(`Request failed (${res.status})`);
            }

            setMessage("Password updated. You can now log in with your new password.");
        } catch (error) {
            setMessage(
                "That reset link may have expired or the password was not accepted. Please request a new reset link and try again."
            );
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
            <h1>Set a new password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving…" : "Update password"}
                </button>
            </form>
            {message ? <p>{message}</p> : null}
        </div>
    );
}