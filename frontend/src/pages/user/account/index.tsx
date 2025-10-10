import lockIcon from '@assets/icons/lock-icon.svg';
import background from '@assets/images/au-background.png';
import halfBackground from '@assets/images/au-half-background.png';
import BrandCard from '@components/card/BrandCard';
import CommonMediaWithContent from '@components/label/CommonMediaWithContent';
import { Outlet } from 'react-router-dom';

export default function Account() {
    return (
        <>
            <div
                className="bg-cover bg-top flex flex-col h-screen items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-[#0C60A1] border-[#000000] border-[1px] flex h-[800px] rounded-[20px] text-[#FFFFFF] text-[16px] w-[1400px]">
                    <div className="flex-1 max-w-[700px] pt-[96px] px-[108px] relative">
                        <div className="mb-[136px]">
                            <BrandCard />
                        </div>
                        <Outlet />
                        <span className="absolute bottom-[36px] left-[36px]">
                            <CommonMediaWithContent
                                imageUrl={lockIcon}
                                imageSize="SMALL"
                            >
                                <span className="font-[400] leading-[100%] text-[12px] text-nowrap">
                                    Data Privacy
                                </span>
                            </CommonMediaWithContent>
                        </span>
                    </div>
                    <div
                        className="bg-[position:bottom_center] bg-cover flex-1 max-w-[700px] rounded-r-[20px]"
                        style={{ backgroundImage: `url(${halfBackground})` }}
                    >
                    </div>
                </div>
            </div>
        </>
    );
};