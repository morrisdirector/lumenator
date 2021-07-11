export class DataService {
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
}
