import React from 'react';
import ButtonProps from '@typings/ButtonProps';
import Link from 'next/link';

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const baseClassName: string =
        'pointer-events-auto text-white bg-second-color-normal py-2 px-4 transition duration-300 ease-in-out hover:bg-second-color-dark focus:bg-second-color-dark text-2xl rounded-3xl';

    return props.href ? (
        <Link
            href={props.href}
            className={`${baseClassName} ${props.className}`}
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
            className={`${baseClassName} ${props.className}`}
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
