import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CreditNoteCancellationsService } from 'src/app/user/data/services/credit-note-cancellations.service';
import { CreditNoteService } from 'src/app/user/data/services/credit-note.service';
import { Invoice } from 'src/app/user/data/types/customer-types/invoice';
import { CreditNoteDetailsComponent } from '../../credit-note-management/credit-note-details/credit-note-details.component';
import { CreateCreditNoteCancellationsComponent } from '../dialogs/create-credit-note-cancellations/create-credit-note-cancellations.component';
import { CreditNoteCancellationDetailsComponent } from '../dialogs/credit-note-cancellation-details/credit-note-cancellation-details.component';
import { DeleteCreditNoteCancellationComponent } from '../dialogs/delete-credit-note-cancellation/delete-credit-note-cancellation.component';
import { UpdateCreditNoteCancellationComponent } from '../dialogs/update-credit-note-cancellation/update-credit-note-cancellation.component';
import { VerifyCreditNoteCancellationComponent } from '../dialogs/verify-credit-note-cancellation/verify-credit-note-cancellation.component';

@Component({
  selector: 'app-rejected-credit-note-cancellations',
  templateUrl: './rejected-credit-note-cancellations.component.html',
  styleUrls: ['./rejected-credit-note-cancellations.component.sass']
})
export class RejectedCreditNoteCancellationsComponent extends BaseComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  displayedColumns: string[] = [
    "id",
    "oriInvoiceId",
    "invoiceNo",
    "reasonCode",
    "postedAt",
    "postedBy",
    "status",
    "uraStatus",
    "actions",
    "reason"    
  ];

  pendingCancellations: any[] = [];
  successfulCreditNotes: any[] = [];
  

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  selection = new SelectionModel<any>(true, []);
  data: any;
  error: any;
  isLoading: boolean = true;
  loading = false;
  retryPosting: boolean = false;
  postToUraFailed: boolean = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private _snackBar: MatSnackBar,
    private creditNoteService: CreditNoteService,
    private creditNoteCancellationService: CreditNoteCancellationsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  refresh() {
    this.getInvoices();
  }

  getInvoices() {
    const params = new HttpParams().set("status", "Rejected")

    this.creditNoteCancellationService.fetchByCancellationStatus(params)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (result) => {
          this.pendingCancellations = result;

        

          if(this.pendingCancellations.length > 0){
            this.isLoading = false;

            this.dataSource = new MatTableDataSource<Invoice>(this.pendingCancellations);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            console.log("Credit Notes ", this.pendingCancellations)

          }

        },
        (err) => {
          console.log(err);
        }
      );
  }

  creditNoteCancellationDetails(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      data: row,
    };
    const dialogRef = this.dialog.open(CreditNoteCancellationDetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getInvoices();
    });
  }

  deleteCreditCancellationDetails(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      data: row,
    };
    const dialogRef = this.dialog.open(DeleteCreditNoteCancellationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getInvoices();
    });
  }

  verifyCreditNoteDetails(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      data: row,
    };
    const dialogRef = this.dialog.open(VerifyCreditNoteCancellationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getInvoices();
    });
  }

  updateCreditNoteCancellation(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      data: row,
    };
    const dialogRef = this.dialog.open(UpdateCreditNoteCancellationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.getInvoices();
    });
  }

  veiwReason(data){
    console.log("data: ", data)
    let verifier = "REJECTED BY:  ";
    let message = "  REASON FOR REJECTEON:  ";
    this._snackBar.open(
      verifier+
      data.verifiedBy
      +
      message+
      data.reason,
      "X",
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 200000,
        panelClass: ["snackbar-danger", "snackbar-success"],
      }
    );
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onContextMenu(event: MouseEvent, item: Invoice) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem("mouse");
    this.contextMenu.openMenu();
  }

}
