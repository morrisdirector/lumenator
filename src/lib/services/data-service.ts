export class DataService {
  protected DEVELOPMENT = process.env.NODE_ENV === "development";
  protected HOST = document.location.host;
  constructor() {}

  protected jsonGET(path: string): Promise<any> {
    return fetch(path).then(function (response) {
      return response.json();
    });
  }

  protected jsonPOST(path: string, dto?: any): Promise<any> {
    return fetch(path, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: (dto && JSON.stringify(dto)) || "",
    }).then((res) => res.json());
  }

  protected emptyPOST(path: string): Promise<any> {
    return fetch(path, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "text/plain",
      },
    }).then((res) => res.json());
  }
}
