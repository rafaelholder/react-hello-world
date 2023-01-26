import userEvent from '@testing-library/user-event';
import {Button} from './index';

const { render, screen, fireEvent } = require("@testing-library/react")

describe('<Button />', () => {
    it('Should render button with the text "Load more"', () => {
        render(<Button text="load more" />);

        const button = screen.getByRole('button', {name: /load more/i});
        expect(button).toBeInTheDocument();
    });

    it('Should call function on button click"', () => {
        const fn = jest.fn();

        render(<Button text="load more" onClick={fn}/>);

        const button = screen.getByRole('button', {name: /load more/i});
        fireEvent.click(button);
        userEvent.click(button);

        expect(fn).toHaveBeenCalled();
    });

    it('Should disabled when disabled is true', () => {

        render(<Button text="load more"/>);

        const button = screen.getByRole('button', {name: /load more/i});
       
        expect(button).toBeEnabled();
    });
})