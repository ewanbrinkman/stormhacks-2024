import React from 'react';
import ButtonProps from '@typings/ButtonProps';
import Link from 'next/link';

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const baseClassName: string =
        // 'pointer-events-auto text-white bg-second-color-normal py-2 px-4 transition duration-300 ease-in-out hover:bg-second-color-dark focus:bg-second-color-dark-dark text-2xl rounded-3xl';
        'pointer-events-auto text-white py-2 px-4 text-2xl rounded-full mb-2';

    return props.href ? (
        <Link
            href={props.href}
            className={`${props.className} ${baseClassName}`}
            onClick={(event) => {
                event.currentTarget.blur();
                props.onClick?.()
            }}
            style={props.style}
        >
            {props.children}
        </Link>
    ) : (
        <button
            className={`${props.className} ${baseClassName}`}
            onClick={(event) => {
                event.currentTarget.blur();
                props?.onClick?.()
            }}
            style={props.style}
        >
            {props.children}
        </button>
    );
};

export default Button;
