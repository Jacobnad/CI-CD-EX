import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../views/Confirmation";

    describe("Confirmation view", () => {
    it("should show message when no booking exists", () => {
        // تأكد أن sessionStorage فاضي
        sessionStorage.clear();

        render(
        <MemoryRouter>
            <Confirmation />
        </MemoryRouter>
        );

        // نتحقق من الرسالة الحقيقية الموجودة في الكود
        const message = screen.getByTestId("no-booking-message");

        expect(message).toBeInTheDocument();
        expect(message).toHaveTextContent("Inga bokning gjord!");
    });
    });
