import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ActiveBillsService } from "src/app/admin/data/services/activebills.service";
import { LocalStorageService } from "src/app/admin/data/services/localstorage.service";
import { PurchaseOrderService } from "src/app/user/data/services/purchase-order.service";
import { Category } from "src/app/user/data/types/category";



@Component({
  selector: 'app-canceled-pos',
  templateUrl: './canceled-pos.component.html',
  styleUrls: ['./canceled-pos.component.sass']
})
export class CanceledPosComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  canceledPOs: any;
  displayedColumns: string[] = [
    "id",
    "poName",
    "poNumber",
    "supplierName",
    "supplierAddress",
    "poParticulars",
    "poTotalAmount",
    "poStatus",
    "createdAt",
    "action",
  ];
  dataSource!: MatTableDataSource<Category>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  selection = new SelectionModel<Category>(true, []);
  data: any;
  error: any;
  isLoading: boolean = true;

  routeState: any;
  dataSelected: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private localStorageService: LocalStorageService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getCanceledPurchaseOrders();
  }

  refresh() {
    this.getCanceledPurchaseOrders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCanceledPurchaseOrders() {
    this.purchaseOrderService.getCanceledPurchaseOrders().subscribe(
      (res) => {
        console.log("Canceled: ", res);

        this.canceledPOs = res;

        if (this.canceledPOs) {
          this.isLoading = false;

          this.dataSource = new MatTableDataSource<Category>(this.canceledPOs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }



// updateBill(rejectedBillDet) {
  
//   this.router.navigate(
//     ["/admin/bills/update-bill"],
//     {
//       state: {
//         selectedDetails: JSON.stringify(rejectedBillDet),
//       },
//     }
//   );
// }

veiwReason(data){
  console.log("data: ", data)
  let verifier = "CANCELED BY:  ";
  let message = "  REASON FOR CANCELLATION:  ";
  this._snackBar.open(
    verifier+
    data.verifiedBy
    +
    message+
    data.cancelReason,
    "X",
    {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 200000,
      panelClass: ["snackbar-danger", "snackbar-success"],
    }
  );
}  


  
}
