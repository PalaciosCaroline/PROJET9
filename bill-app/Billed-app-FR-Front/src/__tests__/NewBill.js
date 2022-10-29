/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import "@testing-library/jest-dom";
import {
  getByRole,
  getByTestId,
  getByLabelText,
  fireEvent,
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { mockStore, mockedBills} from "../__mocks__/store";
import { log } from "console";
import router from "../app/Router.js";

import { fn } from "jquery";


jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then New Bill form should display", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.tld",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("Then I upload a new file with a good format, a new file is upload", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      window.onNavigate(ROUTES_PATH.NewBill);
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBilltest = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBilltest.handleChangeFile(e));
      const file = new File(["FileImage"], "image.png", { type: "image/png" });
      const newBillFile = screen.getByTestId("file");

      newBillFile.addEventListener("change", handleChangeFile);
      userEvent.upload(newBillFile, file);
      const newBillFileName = screen.getByTestId("expense-name");
      expect(newBillFile.files[0].name).toBeDefined();
      expect(newBillFile.files[0].name).toBe("image.png");
    })

    test("Then I upload a new file with a wrong format, a new file is not upload", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      window.onNavigate(ROUTES_PATH.NewBill);
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBilltest = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBilltest.handleChangeFile(e));
      const fileTest = new File(["FilewrongImage"], "image.pdf", {
        type: "image/pdf",
      });
      const newBillFile = screen.getByTestId("file");

      jest.spyOn(window, "alert").mockImplementation(() => {});

      newBillFile.addEventListener("change", handleChangeFile);
      userEvent.upload(newBillFile, fileTest);

      expect(newBillFile.files[0].name).toBeDefined();
      expect(window.alert).toBeCalled();
    })
  })
})

 