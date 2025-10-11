import AuthenticationButton from '@components/buttons/AuthenticationButton';
import ValidCommonInput from '@components/input/ValidCommonInput';
import { putChangePassword } from '@services/account.service';
import { useUserStore } from '@store/useUserStore';
import { InputField } from '@type/grid.type';
import { formatColumnLabel } from '@type/string.util';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface ChangePasswordProps {
    confirmPassword?: string;
    newPassword: string;
    oldPassword?: string;
    username: string;
}

export interface ChangePasswordResult {
    isInitial: boolean;
}

export default function ChangePassword() {
    const navigate = useNavigate();
    const methods = useForm();
    const { username, userRole, setIsInitial } = useUserStore();
    const control = methods.control;
    const submitRef = useRef<HTMLButtonElement>(null);
    const inputMap: InputField[] = [
        {
            disabled: true,
            value: username,
            name: 'username'
        },
        {
            type: 'password',
            placeholder: 'Old Password',
            inputType: 'any',
            name: 'oldPassword'
        },
        {
            type: 'password',
            placeholder: 'New Password',
            inputType: 'any',
            name: 'newPassword'
        },
        {
            type: 'password',
            placeholder: 'Confirm New Password',
            inputType: 'any',
            name: 'confirmPassword'
        }
    ];

    async function handleChangePassword() {
        const { confirmPassword, oldPassword, newPassword } = methods.getValues() as ChangePasswordProps;
        const values: ChangePasswordProps = { username, newPassword };

        if (newPassword === oldPassword) {
            alert('New password cannot be the same as the old password');
            return;
        } else if (confirmPassword !== newPassword) {
            alert('New password do not match');
            return;
        }

        const response = await putChangePassword(values);
        const isInitial = response.data.result.isInitial;

        setIsInitial(isInitial);
        navigate(`/${userRole}/dashboard`);
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
                                    minLength={8}
                                    className="font-[500] p-[8px] text-[#000000] text-[16px]"
                                    key={`input-entry-${indx}`}
                                    isShowError
                                    value={i.value}
                                    rules={{
                                        required: `The ${formatColumnLabel(i.name)} is a required field.`
                                    }}
                                    control={control}
                                    {...i}
                                />
                            ))}
                        </div>
                        <button
                            className="hidden"
                            ref={submitRef}
                            type="submit"
                            onClick={methods.handleSubmit(handleChangePassword)}
                        />
                    </FormProvider>
                </div>
                <div className="flex flex-col items-center w-full">
                    <AuthenticationButton
                        label="Change Password"
                        onButtonClick={handleButtonClick}
                    />
                </div>
            </div>
        </>
    );
}