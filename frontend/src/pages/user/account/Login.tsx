import AuthenticationButton from '@components/buttons/AuthenticationButton';
import ValidCommonInput from '@components/input/ValidCommonInput';
import { postLogin } from '@services/account.service';
import { useUserStore } from '@store/useUserStore';
import { InputField, InputType } from '@type/grid.type';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface LoginFormProps {
    username: string;
    password: string;
}

export interface LoginResult {
    password: string;
    isInitial: boolean;
    token: string;
    userRole: string;
    username: string;
}

export default function Login() {
    const navigate = useNavigate();
    const methods = useForm();
    const { setIsInitial, setToken, setUserRole, setUsername, setOldPassword } = useUserStore();
    const control = methods.control;
    const submitRef = useRef<HTMLButtonElement>(null);
    const inputMap: InputField[] = [
        { type: 'text', placeholder: 'Username', inputType: 'alphanumeric', name: 'username' },
        { type: 'password', placeholder: 'Password', name: 'password' }
    ];

    async function handleLogin() {
        const values = methods.getValues() as LoginFormProps;
        const response = await postLogin(values);
        const userInfo = response.data.result;

        console.log('initial: ', userInfo.isInitial);

        setIsInitial(userInfo.isInitial);
        setOldPassword(userInfo.password);
        setToken(userInfo.token);
        setUserRole(userInfo.userRole);
        setUsername(userInfo.username);
        navigate(`/${userInfo.userRole}/dashboard`);
    }

    function handleButtonClick() {
        if (submitRef.current) {
            submitRef.current.click();
        }
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="pb-[20px] w-full">
                    <FormProvider {...methods}>
                        <div className="flex flex-col gap-[8px]">
                            {inputMap.map((i, indx) => (
                                <ValidCommonInput
                                    className="font-[500] p-[8px] text-[#000000] text-[16px]"
                                    key={`input-entry-${indx}`}
                                    control={control}
                                    value={i.value}
                                    inputType={i.inputType as InputType}
                                    name={i.placeholder?.toLowerCase() ?? ''}
                                    placeholder={i.placeholder}
                                    type={i.type}
                                />
                            ))}
                        </div>
                        <button
                            className="hidden"
                            ref={submitRef}
                            type="submit"
                            onClick={methods.handleSubmit(handleLogin)}
                        />
                    </FormProvider>
                    <label className="cursor-pointer flex gap-[8px] items-center mt-[16px]">
                        <input
                            className="appearance-none bg-white checked:after:content-['✓'] flex h-[20px] items-center justify-center outline-none rounded text-black w-[20px]"
                            type="checkbox"
                        />
                        <span className="leading-[100%] text-[#FFFFFF]">
                            Remember username
                        </span>
                    </label>

                </div>
                <div className="flex flex-col items-center w-full">
                    <AuthenticationButton
                        label="Login"
                        onButtonClick={handleButtonClick}
                    />
                    <p className="pt-3 text-white">
                        Forgot username or password?
                    </p>
                </div>
            </div>
        </>
    );
}