import type { AdminDTO } from "./server/DTOs";

export async function adminPagingHandler(
  query: string, 
  isInQueryMode: boolean, 
  currentPage: number, 
  change: number, 
  totalPages: number) : Promise<{
    error: string,
    errorLoc: string,
    admins: AdminDTO[],
    totalPages: number,
    currentPage: number,
  }> {
    let body;
    let dest;

    try {

      if (isInQueryMode) {
        body = JSON.stringify({ query, currPage: currentPage, change, maxPages: totalPages });
        dest = "/handlers/adminSearch"
      } else {
        body = JSON.stringify({ currPage: currentPage, change, maxPages: totalPages });
        dest = "/handlers/adminPaging"
      }

      const response = await fetch(dest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();

      if (rv.success) {
        return {
          error: '',
          errorLoc: '',
          admins: rv.admins,
          totalPages: rv.totalPages,
          currentPage: rv.currentPage,
        }
      } else if (rv.description === "admins"){
        return {
          error: rv.error,
          errorLoc: "admins",
          admins: [],
          totalPages: 1,
          currentPage: 1,
        }
      } else {
        return {
          error: rv.error,
          errorLoc: "query",
          admins: [],
          totalPages: 1,
          currentPage: 1,
        }
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }