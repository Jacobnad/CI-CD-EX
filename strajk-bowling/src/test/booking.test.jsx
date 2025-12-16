    import { render, screen } from "@testing-library/react";
    import userEvent from "@testing-library/user-event";
    import { MemoryRouter } from "react-router-dom";
    import Booking from "../views/Booking";

    const renderBooking = () =>
    render(
        <MemoryRouter>
        <Booking />
        </MemoryRouter>
    );

    describe("Booking view", () => {
    // ===============================
    // User Story 1: Booking
    // ===============================

    it("should allow user to choose date, time and number of players", async () => {
        const { container } = renderBooking();

        const dateInput = container.querySelector('input[name="when"]');
        const timeInput = container.querySelector('input[name="time"]');
        const playersInput = container.querySelector('input[name="people"]');

        await userEvent.type(dateInput, "2024-12-25");
        await userEvent.type(timeInput, "18:00");
        await userEvent.clear(playersInput);
        await userEvent.type(playersInput, "2");

        expect(dateInput).toHaveValue("2024-12-25");
        expect(timeInput).toHaveValue("18:00");
        expect(playersInput).toHaveValue(2);
    });

    it("should show error message when date is missing", async () => {
        const { container } = renderBooking();

        const timeInput = container.querySelector('input[name="time"]');
        const playersInput = container.querySelector('input[name="people"]');
        const lanesInput = container.querySelector('input[name="lanes"]');

        await userEvent.type(timeInput, "18:00");
        await userEvent.type(playersInput, "2");
        await userEvent.type(lanesInput, "1");

        await userEvent.click(
        screen.getByTestId("booking-submit-button")
        );

        const errorMessage = await screen.findByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
    });

    // ===============================
    // User Story 2: Shoes
    // ===============================

    it("should allow user to select shoe size for all players", async () => {
        const { container } = renderBooking();

        const addShoeButton = screen.getByTestId("add-shoe-button");
        await userEvent.click(addShoeButton);
        await userEvent.click(addShoeButton);

        const shoeInputs = container.querySelectorAll(
        'input[type="text"]'
        );

        expect(shoeInputs).toHaveLength(2);

        await userEvent.type(shoeInputs[0], "42");
        await userEvent.type(shoeInputs[1], "40");

        expect(shoeInputs[0]).toHaveValue("42");
        expect(shoeInputs[1]).toHaveValue("40");
    });

    it("should show error when number of shoes does not match players", async () => {
        const { container } = renderBooking();

        const playersInput = container.querySelector('input[name="people"]');
        const lanesInput = container.querySelector('input[name="lanes"]');

        await userEvent.type(playersInput, "2");
        await userEvent.type(lanesInput, "1");

        await userEvent.click(
        screen.getByTestId("add-shoe-button")
        );

        await userEvent.click(
        screen.getByTestId("booking-submit-button")
        );

        const errorMessage = await screen.findByTestId("error-message");
        expect(errorMessage).toBeInTheDocument();
    });

    // ===============================
    // User Story 3: Remove shoe
    // ===============================

    it("should allow user to remove a shoe size", async () => {
        const { container } = renderBooking();

        const addShoeButton = screen.getByTestId("add-shoe-button");
        await userEvent.click(addShoeButton);
        await userEvent.click(addShoeButton);

        let shoeInputs = container.querySelectorAll(
        'input[type="text"]'
        );
        expect(shoeInputs).toHaveLength(2);

        await userEvent.click(
        screen.getByTestId("remove-shoe-0")
        );

        shoeInputs = container.querySelectorAll(
        'input[type="text"]'
        );
        expect(shoeInputs).toHaveLength(1);
    });
    });
