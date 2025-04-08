import generator from "generate-password-ts";

import bcrypt from "bcryptjs";

import { Role } from "@prisma/client";

import { FacilityDAO } from "./FacilityDAO";

import { AdminDAO } from "./AdminDAO";

let facilityDAO: FacilityDAO = new FacilityDAO();

let adminDAO: AdminDAO = new AdminDAO();

export async function createAndHashPassword(): Promise<{ password: string, hashedPassword: string }> {
    const password: string = generator.generate({
      length  : 10,
      numbers : true,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    return { password, hashedPassword };
}

export const otherServiceInfo = {
  service: {
    select: {
      note: true,
      division: {
        select: {
          divisionID: true,
          name: true,
        },
      },
      updatedAt: true,
    }
  }
};

// pagination utility

type PaginateArgs<T> = {
  model: {
    findMany : (args: any) => Promise<T[]>;
    count    : (args: any) => Promise<number>;
  };
  where    : any;
  select?  : any;
  include? : any;
  orderBy? : any;
  page     : number;
  pageSize : number;
  mapping? : (item: T) => any;
};

export async function paginate<T>({
  model,
  where,
  select,
  include,
  orderBy,
  page,
  pageSize,
  mapping = (item) => item,
}: PaginateArgs<T>) {
  const currentPage = Math.max(1, page);

  const skip = (currentPage - 1) * pageSize;

  const [objects, totalObjects] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: pageSize,

      ...(select  && { select  }),
      ...(include && { include }),
      ...(orderBy && { orderBy }),
    }),
    model.count({
      where
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalObjects / pageSize));

  return {
    results: objects.map(mapping),
    totalPages,
    currentPage,
  };
}

// load more utility

type LoadMoreArgs<T> = {
  model: {
    findMany : (args: any) => Promise<T[]>;
  };
  where         : any;
  select?       : any;
  include?      : any;
  orderBy?      : any;
  offset        : number;
  numberToFetch : number;
  mapping?      : (item: T) => any;
};

export async function loadMore<T>({
  model,
  where,
  select,
  include,
  orderBy,
  offset,
  numberToFetch,
  mapping = (item) => item,
}: LoadMoreArgs<T>) {
  const objects = await model.findMany({
    where,
    skip: offset,
    take: numberToFetch + 1,

    ...(select  && { select  }),
    ...(include && { include }),
    ...(orderBy && { orderBy }),
  });

  const hasMore = objects.length > numberToFetch;

  return {
    results: objects.slice(0, numberToFetch).map(mapping),
    hasMore,
  };
}

// where clause utility

export async function getEmployeeScopedWhereClause(
  facilityID      : string,
  employeeID      : string,
  role            : Role,
  query?          : string,
  queryAttribute? : string,
): Promise<any> {
  const baseWhere: any = {
    facilityID
  };

  if (query) {
    if (query.trim() && queryAttribute) {
      baseWhere[queryAttribute] = {
        contains: query, mode: "insensitive"
      };
    }
  }

  if (role === Role.ADMIN) {
    const hasDivisions = await facilityDAO.facilityHasDivisions(facilityID);

    if (hasDivisions) {
      const divisions = await adminDAO.getDivisions(employeeID);

      const divisionIDs = divisions.map((division) => division.divisionID);

      baseWhere.divisionID = { 
        in: divisionIDs
      };
    }
  }

  return baseWhere;
}