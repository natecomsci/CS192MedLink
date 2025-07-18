import generator from "generate-password-ts";

import bcrypt from "bcryptjs";

export type OtherServiceInfo = { note : string | null; phoneNumbers : string[]; division : { divisionID: string; name: string; } | null; updatedAt : Date; type : string };

export async function getGeneralServiceInfo(serviceID: string): Promise<OtherServiceInfo> {
  const service = await prisma.service.findUnique({
    where: { 
      serviceID 
    },
    select: {
      note: true,
      phoneNumbers: {
        select: {
          info: true
        }
      },
      division: {
        select: {
          divisionID: true,
          name: true
        },
      },
      updatedAt: true,
      type: true
    }
  });

  if (!service) {
    throw new Error(`No Service found with ID ${serviceID}`);
  }

  return {
    ...service,
    phoneNumbers: service.phoneNumbers.map((phoneNumber: { info: string }) => phoneNumber.info)
  };
}

// for creating Admin accounts

export async function createAndHashPassword(): Promise<{ password: string, hashedPassword: string }> {
    const password: string = generator.generate({
      length  : 10,
      numbers : true,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    return { password, hashedPassword };
}

// pagination utility

type PaginateArgs<T> = {
  model: {
    findMany : (args: any) => Promise<T[]>;
    count    : (args: any) => Promise<number>;
  };
  where    : Record<string, unknown>;
  select?  : Record<string, unknown>;
  include? : Record<string, unknown>;
  orderBy? : Record<string, unknown>;
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
    })
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
    count    : (args: any) => Promise<number>;
  };
  where         : Record<string, unknown>;
  select?       : Record<string, unknown>;
  include?      : Record<string, unknown>;
  orderBy?      : Record<string, unknown>;
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
  const [objects, totalResults] = await Promise.all([
    model.findMany({
      where,
      skip: offset,
      take: numberToFetch + 1,

      ...(select  && { select  }),
      ...(include && { include }),
      ...(orderBy && { orderBy }),
  }),
  model.count({
    where
  })
]);

  const results = objects.slice(0, numberToFetch).map(mapping)

  const totalFetched = offset + results.length;

  const hasMore = objects.length > numberToFetch;

  return {
    results,
    totalResults,
    totalFetched,
    hasMore,
  };
}