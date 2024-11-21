import {PaginationState} from "@tanstack/react-table"
import {useState} from "react"

const usePagination = (initialState: PaginationState) => {
  const [pagination, setPagination] = useState(initialState)

  const next = () => {
    setPagination(({pageIndex, pageSize}) => {

      if (pageIndex === pageSize) {
        return {
          pageIndex,
          pageSize
        }
      }

      return {
        pageIndex: pageIndex + 1,
        pageSize
      }
    })
  }

  const prev = () => {
    setPagination(({pageIndex, pageSize}) => {

      if (pageIndex === 0) {
        return {
          pageIndex,
          pageSize
        }
      }

      return {
        pageIndex: pageIndex - 1,
        pageSize
      }
    })
  }

  const navigateTo = (destinationPageIndex: number) => {
    setPagination(({pageIndex, pageSize}) => {

      if (destinationPageIndex < 0 || destinationPageIndex > pageSize) {
        return {
          pageIndex,
          pageSize
        }
      }

      return {
        pageIndex: destinationPageIndex,
        pageSize
      }
    })
  }

  return {
    next,
    prev,
    navigateTo,
    pagination
  }
}

export default usePagination
