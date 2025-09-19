import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonGroupRadioCheckbox, { CommonGroupRadioCheckboxProps } from '@components/checkbox/CommonRadioCheckboxGroup';
import { classMerge } from '@utils/css.util';
import { ButtonOptionsProps } from './';

interface AccountActionBarProps<T extends string> extends CommonGroupRadioCheckboxProps<T> {
    buttonOptions?: ButtonOptionsProps[];
}

export default function AccountActionBar<T extends string>({
    buttonOptions,
    ...props
}: AccountActionBarProps<T>) {

    return(
        <ShadowCard>
            <div className="flex justify-between p-[20px] w-full">
                <div className="flex gap-[12px]">
                    {buttonOptions?.map((btn, btnKey) => (
                        <CommonButton
                            buttonLabel={btn.label}
                            buttonStyle="blue"
                            className={
                                classMerge(
                                    btn.condition
                                        ? 'block'
                                        : 'hidden'
                                )
                            }
                            size="m"
                            key={`${btn.label}-${btnKey}`}
                            isRoundedFull={false}
                            onButtonClick={btn.onButtonClick}
                        />
                    ))}
                </div>
                <CommonGroupRadioCheckbox<T> {...props} />
            </div>
        </ShadowCard>
    );
}