/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom";
import {
  getByRole,
  getByTestId,
  getByLabelText,
  fireEvent,
  waitFor
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { log } from "console";
import router from "../app/Router.js";
import { data, fn } from "jquery";

jest.mock("../app/store", () => mockStore)
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then The Title is display", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    })

    test("Then New Bill form should display", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();
    })

    test(('Then, it should them in the page'), () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByTestId('expense-type')).toBeTruthy()
      expect(screen.getByTestId('expense-name')).toBeTruthy()
      expect(screen.getByTestId('datepicker')).toBeTruthy()
      expect(screen.getByTestId('amount')).toBeTruthy()
      expect(screen.getByTestId('vat')).toBeTruthy()
      expect(screen.getByTestId('pct')).toBeTruthy()
      expect(screen.getByTestId('commentary')).toBeTruthy()
      expect(screen.getByTestId('file')).toBeTruthy()
      expect(document.querySelector('#btn-send-bill')).toBeTruthy();
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const html = NewBillUI()
      document.body.innerHTML = html

    test("should require the select type expense", () => {
      const selectType = screen.getByTestId("expense-type");
      expect(selectType).toBeRequired();
    })
    test("should require the input type date", () => {
      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate).toBeRequired();
    })
    test("should require the input type number amount", () => {
      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount).toBeRequired();
    })
    test("should require the input type number pct", () => {
      const inputPct = screen.getByTestId("pct");
      expect(inputPct).toBeRequired();
    })
    test("should require the input type file", () => {
      const inputfile = screen.getByTestId("file");
      expect(inputfile).toBeRequired();
    })

    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-window'))
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-window')
      const mailIcon = screen.getByTestId('icon-mail')
      expect(windowIcon).not.toHaveClass('active-icon');
      expect(mailIcon).toHaveClass('active-icon');
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      // jest.spyOn(mockStore, "bills")
      // jest.mock("../app/store");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("Then I upload a new file with a good format, a new file is upload", async () => {
      
        // jest.spyOn(mockStore, "bills")
        // jest.mock("../app/store");
        // mockStore.bills().create = jest.fn().mockResolvedValue() 
        
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      window.onNavigate(ROUTES_PATH.NewBill);
      const html = NewBillUI();
      document.body.innerHTML = html;
      
      // const console = jest.fn(() => log = '1234');
      // const billsSpy = jest.spyOn(mockStore, "bills");

      const newBilltest = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
        
      });

      // jest.spyOn(mockStore , 'bills').mockImplementation(() => {
      //   return {
      //       create: () => {
      //           return Promise.resolve({"fileUrl": "https://localhost:3456/images/test.jpg", "key": "1234"})
      //       },
      //   }
      // })

      const billsSpy = jest.spyOn(mockStore.bills(), "create");  
      newBilltest.mockStore = jest.fn().mockResolvedValue({});
      console.log = jest.fn()
      // console.log('1234');
      // jest.spyOn(console, "log").mockImplementation(() => {});
      const handleChangeFile = jest.fn((e) => newBilltest.handleChangeFile(e));

      
      const file = new File(["FileImage"], "image.png", { type: "image/png" });
      const newBillFile = screen.getByTestId("file");

      expect(newBillFile.files).toHaveLength(0)
      newBillFile.addEventListener("change", (e) => handleChangeFile(e));
      // fireEvent.change(newBillFile, { target: { value: "image.png" } });
      
      userEvent.upload(newBillFile, file)
      expect(newBillFile.files[0]).toStrictEqual(file)
      expect(newBillFile.files.item(0)).toStrictEqual(file)
      expect(newBillFile.files).toHaveLength(1)
      expect(newBillFile.files[0].name).toBe("image.png");
      jest.spyOn(window, "alert").mockImplementation(() => {});
      expect(handleChangeFile).toHaveBeenCalledTimes(1);
      expect(window.alert).not.toBeCalled();
      expect(newBillFile.value).not.toBeNull
      //create bills à vérifier
   
      
      await expect(console.log).toHaveBeenCalledTimes(2)
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
     
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
      expect(handleChangeFile).toHaveBeenCalled()
      expect(newBillFile.files[0].name).toBeDefined();
      expect(window.alert).toBeCalledWith('Seulement les formats de fichiers jpg/jpeg et png sont autorisés!');
      expect(newBillFile.value).toBeNull
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
    const btnSubmit = submit.querySelector('#btn-send-bill')

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
   
    submit.addEventListener('submit', (e) => handleSubmit(e))
    userEvent.click(btnSubmit)
    expect(handleSubmit).toHaveBeenCalled()
    expect(updateBill).toHaveBeenCalled()
  })
})

//Test error occurs on API
describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
    )
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: "a@a"
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    window.onNavigate(ROUTES_PATH.NewBill);
   
  })

test('Then it adds bill to the API and fails with 404 message error', async () => {

  mockStore.bills.mockImplementationOnce(() => {
  return {
    list : () =>  {
      return Promise.reject(new Error("Erreur 404"))
    }
  }})
  window.onNavigate(ROUTES_PATH.Bills)
  await new Promise(process.nextTick);
  const message = await screen.getByText(/Erreur 404/);
  expect(message).toBeTruthy();
});

  test('Then it adds bill to the API and fails with 500 message error', async () => {

    mockStore.bills.mockImplementationOnce(() => {
    return {
      list : () =>  {
        return Promise.reject(new Error("Erreur 500"))
      }
    }})
    window.onNavigate(ROUTES_PATH.Bills)
    await new Promise(process.nextTick);
    const message = await screen.getByText(/Erreur 500/);
    expect(message).toBeTruthy();
  })
})

