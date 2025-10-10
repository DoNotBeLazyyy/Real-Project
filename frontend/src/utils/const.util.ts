import { InputType } from '@type/grid.type';

export const patterns: Record<InputType, RegExp> = {
    alphabet: /[^a-zA-Z\s]/g,
    number: /[^0-9]/g,
    alphanumeric: /[^a-zA-Z0-9\s]/g,
    email: /[^a-zA-Z0-9@._-]/g,
    any: /(?!)/
};

export const alphabet = /^[A-Za-z\s]+$/;
export const number = /^[0-9]+$/;
export const alphanumeric = /^[A-Za-z0-9]+$/;
export const email= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const any = /^.*$/;