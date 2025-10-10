import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonGroupRadioCheckbox, { CommonGroupRadioCheckboxProps } from '@components/checkbox/CommonRadioCheckboxGroup';
import { useActionStore } from '@store/useActionStore';
import { DataStoreHook, StateProps } from '@type/common.type';
import { classMerge } from '@utils/css.util';
import { ButtonOptionsProps } from '../../pages/user/admin/account';

export interface GridActionbarProps<TData> extends CommonGroupRadioCheckboxProps {
    onSubmitClick: VoidFunction;
    setSelected: StateProps<string>;
    useDataStore: DataStoreHook<TData>;
}

export default function GridActionbar<TData>({
    onSubmitClick,
    setSelected,
    useDataStore,
    ...props
}: GridActionbarProps<TData>) {
    const { newRowData, modifiedRows, selectedRowData, setData } = useDataStore();
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
        setData('modifiedRows', []);
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
        if (newRowData.length === 0 && selectedRowData.length === 0 && modifiedRows.length === 0)  {
            setSelected?.(selected);
            handleDisableAddRemove();
            handleDisableDelete();
            handleDisableModification();
            return;
        }
        const confirmSwitch = window.confirm('If you switch user type now your changes will be discarded, would you like to proceed?');
        if (confirmSwitch) {
            setSelected?.(selected);
            handleDisableAddRemove();
            handleDisableDelete();
            handleDisableModification();
        }
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
                    {...props}
                    onChangeSelect={handleSelect}
                />
            </div>
        </ShadowCard>
    );
}