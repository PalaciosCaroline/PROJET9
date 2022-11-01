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
import { mockedBills} from "../__mocks__/store";
import mockStore from "../__mocks__/store";
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
      //create bills à vérifier

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


// describe('Given I am connected as an employee', () => {
//   describe('When I create a new bill', () => {
//       it.todo('Add bill to mock API POST', async () => {
         //  méthode post

         //  expect(bills.data.length).toBe(?);
//       });
//     })
//   })

describe("I submit a valid bill form", () => {
  test('then a bill is created', async () => {

    document.body.innerHTML = NewBillUI()
     const newBill = new NewBill({
       document, onNavigate, store: mockStore , localStorage: window.localStorage
     })          
 
    const submit = screen.queryByTestId('form-new-bill')

    const newBillTest = {
      name: "newBillTestName",
      date: "2020-01-01",
      type: "Hôtel et logement",
      pct: 10,
      amount: 200,
      "email": "a@a",
      vat: 40,
      commentary: "",
      fileName: "imageTest",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
    }

    // newBill.createBill = (newBillTest) => newBillTest
    // document.querySelector(`input[data-testid="expense-name"]`).value = newBillTest.name
    // document.querySelector(`input[data-testid="datepicker"]`).value = newBillTest.date
    // document.querySelector(`select[data-testid="expense-type"]`).value = newBillTest.type
    // document.querySelector(`input[data-testid="amount"]`).value = newBillTest.amount
    // document.querySelector(`input[data-testid="vat"]`).value = newBillTest.vat
    // document.querySelector(`input[data-testid="pct"]`).value = newBillTest.pct
    // document.querySelector(`textarea[data-testid="commentary"]`).value = newBillTest.commentary
    // newBill.fileUrl = newBillTest.fileUrl;
    // newBill.fileName = newBillTest.fileName 

    fireEvent.change(screen.getByTestId('expense-type'), { target: { value: newBillTest.type } })
    fireEvent.change(screen.getByTestId('expense-name'), { target: { value: newBillTest.name } })
    fireEvent.change(screen.getByTestId('datepicker'), { target: { value: newBillTest.date } })
    fireEvent.change(screen.getByTestId('amount'), { target: { value: newBillTest.amount } })
    fireEvent.change(screen.getByTestId('vat'), { target: { value: newBillTest.vat } })
    fireEvent.change(screen.getByTestId('pct'), { target: { value: newBillTest.pct } })
    fireEvent.change(screen.getByTestId('commentary'), { target: { value: newBillTest.commentary } })
    newBill.fileUrl = newBillTest.fileUrl;
    newBill.fileName = newBillTest.fileName 

    const handleSubmit = jest.spyOn(newBill, 'handleSubmit')
    const updateBill = jest.spyOn(newBill, 'updateBill')
   
    submit.addEventListener('click', (e) => handleSubmit(e))
    fireEvent.click(submit)

    expect(handleSubmit).toHaveBeenCalled()
    expect(updateBill).toHaveBeenCalled()
  })
})

