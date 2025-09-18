import AuthenticationButton from '@components/buttons/AuthenticationButton';
import Input, { InputProps } from '@components/input/Input';

export default function StudentLogin() {
    const inputMap: InputProps[] = [
        { type: 'text', placeholder: 'Username' },
        { type: 'password',placeholder: 'Password' }
    ];

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="pb-[20px] w-full">
                    <div className="flex flex-col gap-[8px]">
                        {inputMap.map((item, key) => (
                            <Input
                                key={key}
                                type={item.type}
                                placeholder={item.placeholder}
                            />
                        ))}
                    </div>
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
                    <AuthenticationButton label="Login"/>
                    <p className="pt-3 text-white">
                        Forgot username or password?
                    </p>
                </div>
            </div>
        </>        
    );
}