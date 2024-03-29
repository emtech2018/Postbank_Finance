import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActiveBillsService } from "src/app/admin/data/services/activebills.service";

import { CostCentersService } from "src/app/admin/data/services/cost-centers.service";
import { PendingBillsComponent } from "src/app/admin/modules/bills/pending-bills/pending-bills.component";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { PendingDirectTransferComponent } from "../../pending-direct-transfer.component";
import { NotificationService } from "src/app/admin/data/services/notification.service";

@Component({
  selector: "app-pending-direct-info",
  templateUrl: "./pending-direct-info.component.html",
  styleUrls: ["./pending-direct-info.component.sass"],
})
export class PendingDirectInfoComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  displayedColumns: string[] = [
    "id",
    "accountNo",
    "accountName",
    "amount",
    "parttranstype",
    "exchangeRate",
    "narration",
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild("paginatorBill") paginatorBill: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  selection = new SelectionModel<any>(true, []);

  costCenterDetails: any;

  billInfoDetails: any;
  Data: any;

  status!: string;

  resData: any;

  statusForm: FormGroup;

  rejected: boolean = false;
  approved: boolean = false;
  currentUser: any;
  postedBy: any;
  canVerify: boolean = false;

  isTransactionLoading: boolean = false;
  hideValidation = false;

  constructor(
    public dialogRef: MatDialogRef<PendingDirectTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private costCenterService: CostCentersService,
    private snackbar: SnackbarService,
    private tokenCookieService: TokenCookieService,
    public datepipe: DatePipe,
    private activeBillsService: ActiveBillsService,
    private _snackBar: MatSnackBar,
    private notificationAPI: NotificationService,
  ) { }
  ngOnInit(): void {
    this.currentUser = this.tokenCookieService.getUser().username;
    this.Data = this.data.data;

    if (this.data.action === 'deletedOrRejected') {
      this.hideValidation = true;
    }
    

    this.billInfoDetails = this.data.data.partrans;

    this.postedBy = this.Data.postedBy;

    if (this.postedBy === this.currentUser) {

      this.snackbar.showNotification("snackbar-danger", "You cannot verify this transaction!");

      this.canVerify = false;

    } else {
      this.canVerify = true;
    }

    console.log("this.billDet: ", this.data);

    this.refreshDatasource();

    console.log("Data: ", this.Data);

    this.statusForm = this.createStatusForm();
  }
  refreshDatasource() {
    this.dataSource = new MatTableDataSource<any>(this.billInfoDetails);

    this.dataSource.sort = this.sort;
    console.log("Refreshed");
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorBill;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createStatusForm(): FormGroup {
    return this.fb.group({
      reason: ["", [Validators.required]],
    });
  }

  reject() {
    this.rejected = true;
    this.approved = false;

    this.status = "Rejected";
    if (!this.statusForm.value == null) {
      this.changeStatus();
    }
  }
  approve() {
    this.approved = true;
    this.rejected = false;

    this.status = "Approved";

    this.changeStatus();
  }

  changeStatus() {
    this.isTransactionLoading = true;
    const params = new HttpParams()
      .set("id", this.Data.id)
      .set("status", this.status)
      .set("verifiedBy", this.currentUser)
      .set("reason", this.statusForm.value.reason)
      .set("verifiedTime", new Date().toDateString());

    console.log("Form = ", params.toString());

    this.activeBillsService.approvePendingTransaction(params).subscribe(
      (res) => {
        this.dialogRef.close();

        let message = "FINACLE RESPONSE";
        this.resData = res;
        console.log("res = ", res);
        if(this.status === "Approved"){
          if (this.resData.status == "Success") {
            this._snackBar.open(
              message +
              "\n" +
              "STATUS: " +
              this.resData.status +
              "\n" +
              "TRANSACTION ID: " +
              this.resData.tran_id +
              "\n" +
              "TRANSACTION DATE: " +
              this.resData.tran_date,
              "X",
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000000,
                panelClass: ["snackbar-success", "snackbar-success"],
              }
            );
          } 
          
          else if (this.resData.status != "Success") {
            this._snackBar.open(
              message +
              "\n" +
              "status: " +
              this.resData.status +
              "\n" +
              "ERROR DESCRIPTION: " +
              this.resData.description +
              "\n" +
              "ERROR CODE: " +
              this.resData.errorCode,
              "X",
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000000,
                panelClass: ["snackbar-danger", "snackbar-success"],
              }
            );
          }
        }
       else if (this.status === "Rejected") {
        this.notificationAPI.alertSuccess("Transaction Rejected Successfully.");
       }

        this.isTransactionLoading = false;
      },
      (err) => {
        console.log(err);
        this.isTransactionLoading = false;
      }
    );
  }


}
