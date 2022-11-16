/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import BillsContainer from "../containers/Bills"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"
import { log } from 'console'

import NewBill from '../containers/NewBill.js'
describe("Given I am connected as an employee", () => {
  describe('When I am on Bills page but it is loading', () => {
    test('Then, Loading page should be rendered', () => {
      document.body.innerHTML = BillsUI({ loading: true })
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Bills page but back-end send an error message', () => {
    test('Then, Error page should be rendered', () => {
      document.body.innerHTML = BillsUI({ error: 'some error message' })
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

// describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page loaded", () => {

    test("display Bills page", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const mesNotesDeFrais  = screen.getByTestId("Mes-notes-de-frais")
      expect(mesNotesDeFrais).toBeTruthy()
      const btnNewBill  = screen.getByTestId("btn-new-bill")
      expect(btnNewBill).toBeTruthy()
      const contentBills  = screen.getByTestId("tbody")
      expect(contentBills).toBeTruthy()
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
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-window')
      const mailIcon = screen.getByTestId('icon-mail')
      expect(windowIcon).toHaveClass('active-icon');
      expect(mailIcon).not.toHaveClass('active-icon');
    })
    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => 
       (a < b) ? 1 : -1
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("and display all iconEye ", async () => {
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }))
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router()
      // window.onNavigate(ROUTES_PATH.Bills)

      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      // const billsTest = new BillsContainer({
      //   document, onNavigate, store: mockStore, localStorage: window.localStorage
      // })
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = await screen.getAllByTestId("icon-eye");
      expect(iconEye[0]).toBeTruthy()
      expect(iconEye[1]).toBeTruthy()
      expect(iconEye[2]).toBeTruthy()
      expect(iconEye[3]).toBeTruthy()
    })
  })
})
// test d'intégration 
describe('Given I am connected as Employe and I am on bills page', () => {
  describe('When I click on the icon eye', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: "a@a"
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  })

    test('a function handleClickIconEye is called', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = screen.getAllByTestId("icon-eye");
      const modalFile = document.getElementById('modaleFile')
      const handleClickIconEye = jest.fn(BillsContainer.handleClickIconEye);
      expect(iconEye.length).toBe(4)
      iconEye.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye(icon))
        userEvent.click(icon);
      })
      expect(handleClickIconEye).toHaveBeenCalledTimes(iconEye.length)
    })

    test("a modal show for each icon", () => {
      const billsTest = new BillsContainer({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      document.body.innerHTML = BillsUI({ data: bills })
      const handleClickIconEye = jest.fn((icon) => billsTest.handleClickIconEye(icon));
      const iconEye = screen.getAllByTestId("icon-eye");
      
      const modaleFile = document.getElementById("modaleFile")
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
      iconEye.forEach(icon => {
        icon.addEventListener('click', handleClickIconEye(icon))
        userEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(modaleFile).toBeTruthy();
        expect(modaleFile).toHaveClass("show")
      })
    })
    
    test('A modal should open with a right bill view', () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const iconEye = screen.getAllByTestId('icon-eye')[0]
      const fileUrl = "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      const handleClickIconEye = jest.fn(BillsContainer.handleClickIconEye);
      iconEye.addEventListener('click', handleClickIconEye)
      fireEvent.click(iconEye);
      expect(iconEye.dataset.billUrl).toEqual(fileUrl)
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employe and I am on bills page", () => {
  describe("and I click on newBill button", () => {
    beforeEach(() => {
      // jest.spyOn(mockStore, "bills")
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
    })
    test("a newBill form is show", async () => {
      document.body.innerHTML = BillsUI({})
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      window.onNavigate(ROUTES_PATH.Bills)
      const bills = new BillsContainer({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      document.body.innerHTML = BillsUI({ data: bills})
      const modaleFileEmploye = screen.getByTestId('modaleFileEmploye');
      const  handleClickNewBill = jest.fn(bills.handleClickNewBill);
      const btnNewBill  = await screen.getByTestId("btn-new-bill")
      expect(btnNewBill).toBeTruthy()
      btnNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(btnNewBill);
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(modaleFileEmploye).toBeTruthy();
      expect(screen.findAllByTitle("Envoyer une note de frais")).toBeTruthy()
    })
  })

// test d'intégration GET
describe("Given I am a user connected as Employe and I am on bills page", () => {
  describe(" When fetches bills from mock API POST and no error occurs on API, ", () => {
  beforeEach(() => {
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
    })

    test("receive all data", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsTest = new BillsContainer({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
      document.body.innerHTML = BillsUI({ data: bills})
      const billsSpy = jest.spyOn(mockStore, "bills");
      const dataSpy = jest.spyOn(billsTest, "getBills");
      const data = await billsTest.getBills()
      await new Promise(process.nextTick);
      expect(billsSpy).toHaveBeenCalledTimes(1);
      expect(dataSpy).toHaveBeenCalledTimes(1);
      expect(data.length).toBe(4)
    })

    test("receive no data when no store", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const billsTest = new BillsContainer({ document, onNavigate, store: null, localStorage: window.localStorage })
      document.body.innerHTML = BillsUI({ data: bills})
      const billsSpy = jest.spyOn(mockStore, "bills");
      const dataSpy = jest.spyOn(billsTest, "getBills");
      const data = await billsTest.getBills()
      await new Promise(process.nextTick);
      expect(billsSpy).toHaveBeenCalledTimes(1);
      expect(dataSpy).toHaveBeenCalledTimes(1);
      expect(data).toBe(undefined)
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
  
      test('if corrupted data was introduced, should log the error}', async () => {
        const storeTest = {
          bills() {
            return {
              list() {
                return Promise.resolve([{
                  "id": "47qAXb6fIm2zOKkLzMro",
                  "vat": "80",
                  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                  "status": "pending",
                  "type": "Hôtel et logement",
                  "commentary": "séminaire billed",
                  "name": "encore",
                  "fileName": "preview-facture-free-201801-pdf-1.jpg",
                  "date": "wrongDate",
                  "amount": 400,
                  "commentAdmin": "ok",
                  "email": "a@a",
                  "pct": 20
                }])
              },
            }
          }
        }
        const billsTest = new BillsContainer({ document, onNavigate, store: storeTest, localStorage: window.localStorage })
        const consoleLog = jest.spyOn(console, 'log')
        const data = await billsTest.getBills()
        expect(consoleLog).toHaveBeenCalled()     
      }) 
    }) 
  })
})

describe("Given I am a user connected as Employe", () => {
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      // jest.spyOn(mockStore, "bills")
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
    })
   
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
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
        mockStore.bills.mockImplementationOnce(() => {
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
})





