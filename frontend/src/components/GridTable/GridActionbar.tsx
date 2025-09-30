import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonGroupRadioCheckbox from '@components/checkbox/CommonRadioCheckboxGroup';
import { useActionStore } from '@store/useActionStore';
import { DataStoreHook, StateProps } from '@type/common.type';
import { classMerge } from '@utils/css.util';
import { ButtonOptionsProps } from '../../pages/user/admin/account';

export interface GridActionbarProps<TData> {
    radioOptions: string[];
    onSubmitClick: VoidFunction;
    setSelected: StateProps<string>;
    useDataStore: DataStoreHook<TData>;
}

export default function GridActionbar<TData>({
    radioOptions,
    onSubmitClick,
    setSelected,
    useDataStore
}: GridActionbarProps<TData>) {
    const { setData } = useDataStore();
    const { isAddRemove, isDelete, isModify, setAction } = useActionStore();
    const buttonOptions: ButtonOptionsProps[] = [
        {
            label: 'New Records',
            condition: !isAddRemove && !isModify && !isDelete,
            onButtonClick: handleEnableAddRemove
        },
        {
            label: 'Modify Records',
            condition: !isAddRemove && !isModify && !isDelete,
            onButtonClick: handleEnableModification
        },
        {
            label: isDelete
                ? 'Delete Selected Rows'
                : 'Delete Records',
            condition: !isAddRemove && !isModify,
            onButtonClick: isDelete
                ? onSubmitClick
                : handleEnableDelete
        },
        {
            label: 'Save Changes',
            condition: isModify || isAddRemove,
            onButtonClick: onSubmitClick
        },
        {
            label: 'Discard Changes',
            condition: isModify || isAddRemove || isDelete,
            onButtonClick: handleDiscardChanges
        }
    ];

    function handleEnableModification() {
        setAction('isModify', true);
    }

    function handleDisableModification() {
        setAction('isModify', false);
    }

    function handleEnableAddRemove() {
        setAction('isAddRemove', true);
    }

    function handleDisableAddRemove() {
        setAction('isAddRemove', false);
        setData('newRowData', []);
    }

    function handleEnableDelete() {
        setAction('isDelete', true);
    }

    function handleDisableDelete() {
        setAction('isDelete', false);
        setData('selectedRowData', []);
    }

    function handleDiscardChanges() {
        if (isModify) {
            handleDisableModification();
        } else if (isAddRemove) {
            handleDisableAddRemove();
        } else if (isDelete) {
            handleDisableDelete();
        }
    }

    function handleSelect(selected: string) {
        setSelected?.(selected);
        setAction('isAddRemove', false);
        setAction('isDelete', false);
        setAction('isModify', false);
    }

    return (
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
                <CommonGroupRadioCheckbox
                    radioOptions={radioOptions}
                    onChangeSelect={handleSelect}
                />
            </div>
        </ShadowCard>
    );
}