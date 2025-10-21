import { useState } from "react";
import { Button } from '../../Finance/Button';
import { FaRegPaperPlane } from "react-icons/fa";
import { MessageModal } from "../MessageModal";

export function SendMessages({ text, type }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div>
                <Button
                    icon={<FaRegPaperPlane />}
                    text={text}
                    onClick={() => setIsOpen(true)}
                />
            </div>

            <MessageModal
                type={type}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
