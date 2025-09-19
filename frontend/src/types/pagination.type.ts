import { CommonButtonProps } from '@components/buttons/CommonButton';
import { NullGridApi } from './common.type';

// Pagination props
export interface DynamicButtonProps extends Omit<CommonButtonProps, 'onButtonClick'> {
    buttonIndex?: number;
    onButtonClick?: VoidFunction | ((pageIndex: number) => void);
}
export interface PaginationProps<T> extends DynamicPaginationProps {
  gridApi?: NullGridApi;
  gridData?: T[];
  paginationSize?: number;
  onUpdatePaginationSize?: (size: number) => void;
}
interface DynamicPaginationProps {
  currentPage?: number;
  totalPages?: number;
}