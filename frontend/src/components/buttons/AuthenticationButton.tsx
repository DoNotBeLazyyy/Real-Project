interface AuthenticationButtonProps {
    disabled?: boolean;
    label: string;
    onButtonClick?: VoidFunction;
}

/**
 * Authentication button component used for actions such as login or password recovery.
 *
 * @example
 * function Login() {
 *   return (
 *      <AuthenticationButton label="Login" />
 *   );
 * }
 *
 */
export default function AuthenticationButton({
    disabled,
    label,
    onButtonClick
}: AuthenticationButtonProps) {
    return (
        <button
            disabled={disabled}
            className="bg-[#000000] min-w-[312px] p-[12px] rounded-[8px] text-[#FFFFFF]"
            onClick={onButtonClick}
        >
            {label}
        </button>
    );
}