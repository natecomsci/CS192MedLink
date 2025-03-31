import type { AdminDTO, UpdateLogDTO } from "./server/DTOs";

export async function pagingQueryHandler(
  {
    page,
    query,
    isInQueryMode,
    currentPage,
    change,
    totalPages,
  }: {
      page: string,
      query: string, 
      isInQueryMode: boolean, 
      currentPage: number, 
      change: number, 
      totalPages: number
    }): Promise<{
        error: string,
        errorLoc: string,
        list: AdminDTO[] | UpdateLogDTO[],
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
        list: rv.admins,
        totalPages: rv.totalPages,
        currentPage: rv.currentPage,
      }
    } else if (rv.description === "admins"){
      return {
        error: rv.error,
        errorLoc: "admins",
        list: [],
        totalPages: 1,
        currentPage: 1,
      }
    } else {
      return {
        error: rv.error,
        errorLoc: "query",
        list: [],
        totalPages: 1,
        currentPage: 1,
      }
    }
    
  } catch (error) {
    throw new Error(`Response status: ${error}`);
  }
}

export async function getAdminData(adminID: String): Promise<{
        firstname: string,
        middlename: string,
        lastname: string,
        divisions: string[],
  }> {
  const body = JSON.stringify({adminID});

  try {
    const response = await fetch("/handlers/adminInfo", {
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

    return {
      firstname: rv.fname,
      middlename: rv.mname,
      lastname: rv.lname,
      divisions: rv.divisions,
    }

  } catch (error) {
    throw new Error(`Response status: ${error}`);
  }
}

export async function resetAdminPassword(adminID:String, passwordConfirmation:String): Promise<{
  value:string, 
  success:boolean,

}> {
    const body = JSON.stringify({adminID, passwordConfirmation});

    try {
      const response = await fetch("/handlers/resetPassword", {
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
          value: rv.newpass,
          success: true,
        }
      } else {
        return{
          value: rv.error,
          success: false,
        }
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }