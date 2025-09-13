import logo from '@assets/images/au-logo.svg';
import CommonButton, { CommonButtonProps } from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import ChatMessage, { ChatMessageProps } from '@components/ChatMessage';
import CommonHeader from '@components/container/CommonHeader';

export default function StudentChat() {
    // Dummy data
    const chatMessages: ChatMessageProps[] = [
        {
            isSent: false,
            messageText: 'Hey, how\'s the project going?',
            time: '12:00 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Pretty good! Just finished the API integration.',
            time: '12:01 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Nice! Did you handle the authentication part?',
            time: '12:02 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Yes, JWT is working fine.',
            time: '12:03 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Cool, let\'s test it tomorrow.',
            time: '12:05 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Sounds good.',
            time: '12:06 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Don\'t forget the database migration.',
            time: '12:07 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Already done.',
            time: '12:08 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Great job!',
            time: '12:10 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Thanks!',
            time: '12:11 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Also, we need to review the UI.',
            time: '12:12 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Yes, I\'m working on the dashboard layout.',
            time: '12:14 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Make sure it’s mobile responsive.',
            time: '12:15 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Already using Tailwind, should be fine.',
            time: '12:16 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Perfect.',
            time: '12:17 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'By the way, did you check the new PR?',
            time: '12:18 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Yes, it\'s looking good.',
            time: '12:19 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Cool, let\'s merge it.',
            time: '12:20 PM',
            avatarUrl: logo
        },
        {
            isSent: false,
            messageText: 'Agreed.',
            time: '12:21 PM',
            avatarUrl: logo
        },
        {
            isSent: true,
            messageText: 'Alright, moving on to testing then.',
            time: '12:22 PM',
            avatarUrl: logo
        }
    ];
    // Button list
    const chatActionButtons: CommonButtonProps[] = [
        {
            buttonLabel: 'Attach',
            buttonStyle: 'white',
            onButtonClick: () => {
                alert('Attach clicked');
            }
        },
        {
            buttonLabel: 'Send',
            buttonStyle: 'blue',
            onButtonClick: () => {
                alert('Send clicked');
            }
        }
    ];

    return (
        <div className="flex flex-col gap-[20px]">
            <CommonHeader
                title="Chats"
            />
            <ShadowCard >
                <div className="flex flex-col gap-[20px] p-[16px] w-full">
                    <div className="flex gap-[16px] w-full">
                        <div className="bg-blue-600 flex flex-shrink-0 font-bold h-12 items-center justify-center rounded-full text-lg text-white w-12">
                        M
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-semibold md:text-base text-gray-900 text-sm">
                            Mico Angelo M. Carillanes
                            </h2>
                            <p className="md:text-sm text-green-500 text-xs">Active now</p>
                        </div>
                    </div>
                    <ShadowCard white>
                        <div className="h-full max-h-[400px] overflow-y-auto p-[16px] relative w-full">
                            <div className="absolute bg-[#FFFFFF] h-[10px] left-[0px] right-[0px] top-[0px] z-10"></div>
                            <ul className="w-full">
                                {chatMessages.map((msg, index) => (
                                    <ChatMessage key={index} {...msg} />
                                ))}
                            </ul>
                        </div>
                    </ShadowCard>
                    <div className="bg-gray-100 flex gap-2 items-center p-3 rounded-lg shadow-md">
                        <input
                            type="text"
                            placeholder="Enter your message..."
                            className="border border-gray-300 flex-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded-full text-gray-700"
                        />
                        <div className="flex gap-[8px]">
                            {chatActionButtons.map((btn, btnKey) => (
                                <CommonButton
                                    buttonLabel={btn.buttonLabel}
                                    buttonStyle={btn.buttonStyle}
                                    isShadowed
                                    key={`${btn.buttonLabel}-${btnKey}`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </ShadowCard>
        </div>
    );
};