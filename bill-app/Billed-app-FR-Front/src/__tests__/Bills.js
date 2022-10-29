/**
 * @jest-environment jsdom
 */

 import '@testing-library/jest-dom'
 import { getByRole, getByTestId, getByLabelText, fireEvent } from '@testing-library/dom'
 import userEvent from '@testing-library/user-event'

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import mockedBills from "../__mocks__/store"
import store from "../__mocks__/store"
import { log } from 'console'

import NewBill from '../containers/NewBill.js'

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toHaveClass('active-icon');
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

//à revoir
describe('Given I am connected as Employe and I am on bills page', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open with a bill view', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = screen.getAllByTestId("icon-eye");
      const modaleFile = document.getElementById("modaleFile")
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
      const handleClickIconEye = jest.fn(BillsUI.handleClickIconEye);
      iconEye.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye)
        userEvent.click(icon);
      })
      expect(handleClickIconEye).toHaveBeenCalledTimes(iconEye.length);

      iconEye[0].addEventListener('click', handleClickIconEye)
      fireEvent.click(iconEye[0]);
      expect(modaleFile).toBeTruthy();
      // expect(modaleFile).toHaveClass('show');
    })
  })
})


// test d'intégration GET
describe("Given I am a user connected as Employe", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: 'Employee', email: "employee@test.tld" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId("Mes-notes-de-frais"))
      const contentBtnNewBill  = await screen.getByTestId("btn-new-bill")
      expect(contentBtnNewBill).toBeTruthy()
      const contentBills  = await screen.getByTestId("tbody")
      expect(contentBills).toBeTruthy()
    })

     // it.todo("fetches bills from mock API GET", async () => {
    //   mockedBills.bills.mockImplementationOnce(() => {
    //     return {
    //       list: () => {
    //         return Promise.resolve([{data: bills}])
    //       }
    //     }
    //   })
    //   document.body.innerHTML = BillsUI({ data: bills})
    //   expect(bills.data.length).toBe(4);
    // })
  })
})

describe("When an error occurs on API", () => {
  beforeEach(() => {
    jest.spyOn(mockedBills, "bills")
    Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
    )
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: "employee@test.tld"
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    router()
  })

  test("When corrupted data was introduced, return unformatted date in that case", async () => {
   
    window.onNavigate(ROUTES_PATH.Bills)

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    bills[0].date = 'wrongDate';
    document.body.innerHTML = BillsUI({ data: bills })
      expect(bills[0].date).toBe('wrongDate');
      const formatDates = screen.getAllByTestId('formatDate');
      expect(formatDates[0]).toHaveTextContent('wrongDate'); 
    })

  test("fetches bills from an API and fails with 404 message error", async () => {
    mockedBills.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })
      document.body.innerHTML = BillsUI({ error: 'Erreur 404' })
      const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockedBills.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })
      document.body.innerHTML = BillsUI({ error: 'Erreur 500' })
      const message = screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
})

