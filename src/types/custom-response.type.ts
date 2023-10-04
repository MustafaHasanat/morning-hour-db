export type CustomResponseType<dataType> = {
  message: string;
  data: dataType;
  status: number;
};
