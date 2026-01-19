import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const res = await fetch(
                `${BASE_URL}/api-auth-djoser/users/reset_password_confirm/`,
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

            // Try to read JSON either way (Djoser returns validation messages in the response)
            let data = null;
            try {
                data = await res.json();
            } catch (_) {
                data = null;
            }

            if (!res.ok) {
                const pwErrors = data?.new_password || data?.detail || data?.non_field_errors;

                if (Array.isArray(pwErrors) && pwErrors.length) {
                    setMessage(pwErrors.join(" "));
                    setIsError(true);
                } else if (typeof pwErrors === "string" && pwErrors) {
                    setMessage(pwErrors);
                    setIsError(true);
                } else {
                    setMessage("Password was not accepted. Please choose a stronger password and try again.");
                    setIsError(true);
                }

                return; // IMPORTANT: stop here so we don’t run the success code below
            }

            setMessage("Password updated. Redirecting you to login…");
            setIsError(false);

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            setMessage(
                "That reset link may have expired or the password was not accepted. Please request a new reset link and try again."
            );
            setIsError(true);
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
            
            {/* Error Message */}
            {message ? (
                <p style={{ color: isError ? "red" : "green" }}>
                    {message}
                </p>
            ) : null}
        </div>
    );
}