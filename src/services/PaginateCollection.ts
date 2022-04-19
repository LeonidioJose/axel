export default class Collection {
  private collection: any;
  constructor() {
    this.collection = [];
  }

  paginate(page_number: number, page_size: number): Array<string> {
    return this.collection.slice(
      (page_number - 1) * page_size,
      page_number * page_size
    );
  }

  add(str: any): Promise<any> {
    return this.collection.push(str);
  }

  isEmpty(): Boolean {
    return this.collection.length === 0;
  }

  length(): number {
    return Number(this.collection.length);
  }
}
