import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActiveBillsService } from "src/app/admin/data/services/activebills.service";

import { CostCentersService } from "src/app/admin/data/services/cost-centers.service";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { PaidBillsComponent } from "../../paid-bills.component";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-paid-bill-info",
  templateUrl: "./paid-bill-info.component.html",
  styleUrls: ["./paid-bill-info.component.sass"],
})
export class PaidBillInfoComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  loading: boolean = false;
  resData: any;

  displayedColumns: string[] = [
    "id",
    "accountNo",
    "accountName",
    "amount",
    "parttranstype",
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

  statusForm: FormGroup;
  //statusTypes: string[] = ["Approved", "Pending", "Rejected"];
  rejected: boolean = false;
  approved: boolean = false;
  currentUser: any;

 

  invoicelist: any[] = [];

  invoiceAvailable: boolean = false;

  subscription!: Subscription;
  error: any;
  isloading: boolean;

  invoicesLoaded: boolean;


  constructor(
    public dialogRef: MatDialogRef<PaidBillsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private costCenterService: CostCentersService,
    private snackbar: SnackbarService,
    private tokenService: TokenStorageService,
    public datepipe: DatePipe,
    private activeBillsService: ActiveBillsService,
    private _snackBar: MatSnackBar,
    private payBill: ActiveBillsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser().username;
    this.Data = this.data.data;

    this.billInfoDetails = this.data.data.partrans;

    console.log("this.billDet: ", this.data);

    this.refreshDatasource();

    this.getInvoices(this.Data.id);
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

  getInvoices(id) {
    this.invoicesLoaded = false;
    this.payBill.getInvoiceByRefId(id).subscribe(
      (response: any) => {

        
        if (response.length === 0) {
          this.invoiceAvailable = false;
        } else {
          this.invoiceAvailable = true;
          this.invoicelist = response;
        }
        console.log("invoicelist = ", this.invoicelist);

        this.invoicesLoaded = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onClickDownloadPdf(item: any) {
    let base64String = item.file;
    this.downloadPdf(base64String, item.filename);
  }

  downloadPdf(base64String, fileName) {
    // Download PDF in Chrome etc.
    const source = `${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }

  retryTransaction(transData) {
    console.log("retrycount: ", transData.retrycount);
    this.loading = true;
    this.payBill
      .retryTransactionById(transData.id)
      .pipe()
      .subscribe(
        (res) => {
          // this.resData = JSON.parse(res);
          this.resData = res;
          let message = 'FINACLE RESPONSE';   
          if (this.resData.status == "SUCCESS") {
            this._snackBar.open(
              "TRANSACTION RESPONSE" + "\n STATUS: " + this.resData,
              //  +
              // "\n TRANSACTION ID| " +
              // this.resData.body.tran_id +
              // "\n TRANSACTION DATE| " +
              // this.resData.body.tran_date,
              "X",
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000000,
                panelClass: ["snackbar-success", "snackbar-danger"],
              }
            );
          } else if (this.resData.status != "SUCCESS") {
            this._snackBar.open(
              message +
                "\n STATUS: " +
                this.resData.status +
                "\n TRANSACTION ID| " +
                this.resData.tran_id +
                "\n TRANSACTION DATE| " +
                this.resData.tran_date,
              "X",
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 2000000,
                panelClass: ["snackbar-danger", "snackbar-success"],
              }
            );
          }

          console.log("Response = ", res);
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          console.log("Error ", err);
          this.snackbar.showNotification("snackbar-danger", err);
        }
      );
  }


}
