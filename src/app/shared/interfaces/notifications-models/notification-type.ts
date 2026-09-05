export class NotificationType {
  public static readonly alertDanger = new NotificationType('alertDanger');
  public static readonly alertSuccess = new NotificationType('alertSuccess');
  public static readonly alertInfo = new NotificationType('alertInfo');
  public static readonly alertWarning = new NotificationType('alertWarning');
  public static readonly toastDanger = new NotificationType('toastDanger');
  public static readonly toastSuccess = new NotificationType('toastSuccess');
  public static readonly toastInfo = new NotificationType('toastInfo');
  public static readonly toastWarning = new NotificationType('toastWarning');

  constructor(private readonly type: string) { }

  public getType() {
    return this.type;
  }

}
