import AuthenticationButton from '@components/buttons/AuthenticationButton';
import Input from '@components/input/Input';

export default function ForgotPassword() {

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="pb-[20px] w-full">
                    <Input
                        placeholder="Enter Username or Email"
                        type="text"
                    />
                </div>
                <div className="flex flex-col items-center w-full">
                    <AuthenticationButton label="Search"/>
                </div>
            </div>
        </>
    );
}