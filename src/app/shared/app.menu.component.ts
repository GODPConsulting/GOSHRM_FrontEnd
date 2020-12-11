// import { MainLayoutComponent } from "./../layout/main-layout.component";
import { Component, Input, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { MenuItem } from "primeng/api";
import { RoleMenuService } from "../services/role-menu.service";
import {AllModulesComponent} from "../all-modules/all-modules.component";
import {All} from "tslint/lib/rules/completedDocsRule";

@Component({
  selector: "app-menu",
  template: `
      <ul
              app-submenu
              [item]="model"
              root="true"
              class="ultima-menu ultima-main-menu clearfix"
              [reset]="reset"
              visible="true"
              parentActive="true"
      ></ul>
  `
})
export class AppMenuComponent implements OnInit {
  @Input() reset: boolean;

  model: any[];

  constructor(
    public app: AllModulesComponent,
    private roleMenuSvr: RoleMenuService
  ) { }

  ngOnInit() {
    this.model = [
      {
        label: "Dashboard",
        icon: "dashboard",
        routerLink: ["/"]
      },


      {
        label: "Admin",
        icon: "home",
        visible: this.roleMenuSvr.hideOrShow(["admin"]),
        items: [
          {
            label: "User Role",
            icon: "",
            routerLink: ["/admin/user-role"],
            visible: this.roleMenuSvr.hideOrShow(["user role"])
          },
          {
            label: "Staff Information",
            icon: "",
            routerLink: ["/admin/staff-info-list"],
            visible: this.roleMenuSvr.hideOrShow(["staff information"])
          },
          {
            label: 'Security',
            visible: this.roleMenuSvr.hideOrShow(["security"]),
            items: [
              {
                label: 'Security Setting',
                routerLink: ['/setup/authentication-list'],
                visible: this.roleMenuSvr.hideOrShow(["security setting"]),
              },
              {
                label: 'Security Questions',
                routerLink: ['/admin/sec-questions-list'],
                visible: this.roleMenuSvr.hideOrShow(["security questions"]),
              },
            ]
          }
        ]
      },


      {
        label: "Organization",
        icon: "toys",
        visible: this.roleMenuSvr.hideOrShow(["organization"]),
        items: [
          {
            label: "Setup",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["organization setup"]),
            items: [
              {
                label: "Company Structure Definition",
                icon: "",
                routerLink: ["/organization/company-structure-definition-list"],
                visible: this.roleMenuSvr.hideOrShow(["company structure definition"])
              },
              {
                label: "Company Structure",
                icon: "",
                routerLink: ["/organization/company-structure-list"],
                visible: this.roleMenuSvr.hideOrShow(["company structure"])
              },
              {
                label: "Company Information",
                icon: "",
                routerLink: ["/organization/company-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["company information"])
              }
            ]
          },

          {
            label: "Workflow",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["workflow setup"]),
            items: [
              {
                label: "Workflow Group",
                icon: "",
                routerLink: ["/setup/workflow-group-list"],
                visible: this.roleMenuSvr.hideOrShow(["workflow group"]),
              },
              {
                label: "Workflow Level",
                icon: "",
                routerLink: ["/setup/workflow-level-list"],
                visible: this.roleMenuSvr.hideOrShow(["workflow level"]),
              },
              {
                label: "Workflow Activation",
                icon: "",
                routerLink: ["/setup/workflow-activation"],
                visible: this.roleMenuSvr.hideOrShow(["workflow activation"]),
              },
              {
                label: "Workflow Staff",
                icon: "",
                routerLink: ["/setup/workflow-staff-list"],
                visible: this.roleMenuSvr.hideOrShow(["workflow staff"]),
              },
              {
                label: "Workflow",
                icon: "",
                routerLink: ["/setup/workflow-mapping-list"],
                visible: this.roleMenuSvr.hideOrShow(["workflow"]),
              }
            ]
          }
          // ,
          // {
          //   label: "EOD",
          //   icon: "",
          //   routerLink: ["/setup/end-of-day"]
          // }
        ]
      },


      {
        label: "General Setup",
        icon: "settings_application",
        visible: this.roleMenuSvr.hideOrShow(["general setup"]),
        items: [
          {
            label: "Country Information",
            icon: "",
            routerLink: ["/setup/country-list"],
            visible: this.roleMenuSvr.hideOrShow(["country information"]),
          },
          {
            label: "State Information",
            icon: "",
            routerLink: ["/setup/state-list"],
            visible: this.roleMenuSvr.hideOrShow(["state information"]),
          },
          {
            label: "City Information",
            icon: "",
            routerLink: ["/setup/city-list"],
            visible: this.roleMenuSvr.hideOrShow(["city information"]),
          },
          {
            label: "Currency Information",
            icon: "",
            routerLink: ["/setup/currency-list"],
            visible: this.roleMenuSvr.hideOrShow(["currency information"]),
          },
          {
            label: "Job Title",
            icon: "",
            routerLink: ["/setup/job-title-list"],
            visible: this.roleMenuSvr.hideOrShow(["job title"]),
          },
          {
            label: "CurrencyRate Information",
            icon: "",
            routerLink: ["/setup/currencyrate-list"],
            visible: this.roleMenuSvr.hideOrShow(["currency rate"]),
          },
          {
            label: "Document Type",
            icon: "",
            routerLink: ["/setup/document-type"],
            visible: this.roleMenuSvr.hideOrShow(["document type"])
          },
          {
            label: "Identification Information",
            icon: "",
            routerLink: ["/setup/identification-list"],
            visible: this.roleMenuSvr.hideOrShow(["identification information"]),
          },
          {
            label: "Credit Bureau",
            icon: "",
            routerLink: ["/credit/credit-bureau-list"],
            visible: this.roleMenuSvr.hideOrShow(["credit bureau"]),
          },
          {
            label: "Email Configuration",
            icon: "",
            routerLink: ["/setup/emailconfig-list"],
            visible: this.roleMenuSvr.hideOrShow(["email configuration"]),
          }
        ]
      },


      {
        label: "Purchases and Payables",
        icon: "contacts",
        visible: this.roleMenuSvr.hideOrShow(["purchase and payables"]),
        items: [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            routerLink: ['/purchases-and-supplier/dashboard']
          },
          {
            label: "Setup",
            icon: "label",
            visible: this.roleMenuSvr.hideOrShow(["purchases setup"]),
            items: [
              {
                label: 'Tax Setup',
                icon: '',
                routerLink: ['/purchases-and-supplier/tax-setup-list'],
                visible: this.roleMenuSvr.hideOrShow(["tax setup"]),
              },
              {
                label: 'Service Terms Setup',
                icon: '',
                routerLink: ['/purchases-and-supplier/service-terms-setup-list'],
                visible: this.roleMenuSvr.hideOrShow(["service terms"]),
              },
              {
                label: 'Supplier Type Setup',
                icon: '',
                routerLink: ['/purchases-and-supplier/supplier-type-setup-list'],
                visible: this.roleMenuSvr.hideOrShow(["supplier type"]),
              }
            ]
          },
          {
            label: 'Supplier Information',
            icon: "label",
            visible: this.roleMenuSvr.hideOrShow(["supplier information"]),
            items: [
              {
                label: 'Approved Suppliers',
                icon: '',
                routerLink: ['/purchases-and-supplier/supplier-list'],
                visible: this.roleMenuSvr.hideOrShow(["approved suppliers"]),
              },
              {
                label: 'Pending Suppliers',
                icon: '',
                routerLink: ['/purchases-and-supplier/pending-suppliers'],
                visible: this.roleMenuSvr.hideOrShow(["pending suppliers"]),
              },
              {
                label: "Supplier Approval List",
                icon: "",
                routerLink: ["/purchases-and-supplier/supplier-approval"],
                visible: this.roleMenuSvr.hideOrShow(["supplier approval"])
              },
            ]
          },
          {
            label: "Purchase information",
            icon: "label",
            visible: this.roleMenuSvr.hideOrShow(["purchase information"]),
            items: [
              {
                label: "PRN",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["purchase requsitions"]),
                items: [
                  {
                    label: 'Purchase Requisitions',
                    icon: '',
                    routerLink: ["/purchases-and-supplier/requisition-list"],
                    visible: this.roleMenuSvr.hideOrShow(["prn list"])
                  },
                  {
                    label: 'Requisition Approval',
                    icon: "",
                    routerLink: ['/purchases-and-supplier/prn-approvals'],
                    visible: this.roleMenuSvr.hideOrShow(["prn approval"])
                  },
                ],

              },

              {
                label: 'Bids',
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["bids"]),
                items: [
                  {
                    label: 'Bids List',
                    icon: '',
                    routerLink: ['/purchases-and-supplier/bids'],
                    visible: this.roleMenuSvr.hideOrShow(["bids list"])
                  },
                  {
                    label: 'Bids Approval',
                    icon: "",
                    routerLink: ['/purchases-and-supplier/bids-approvals'],
                    visible: this.roleMenuSvr.hideOrShow(["bids approval"])
                  },
                ],

              },

              {
                label: 'Local Purchase Order',
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["local purchase order"]),
                items: [
                  {
                    label: 'LPO Lists',
                    icon: '',
                    routerLink: ['/purchases-and-supplier/lpos'],
                    visible: this.roleMenuSvr.hideOrShow(["lpo list"])
                  },
                  {
                    label: 'LPO Approval',
                    icon: '',
                    routerLink: ['/purchases-and-supplier/lpo-approvals'],
                    visible: this.roleMenuSvr.hideOrShow(["lpo approval"])
                  },
                ],

              },


              {
                label: 'Purchase Payment',
                icon: '',
                visible: this.roleMenuSvr.hideOrShow(["purchase payment"]),
                items: [
                  {
                    label: 'Invoice',
                    visible: this.roleMenuSvr.hideOrShow(["invoice"]),
                    items: [
                      {
                        label: 'Invoices List',
                        routerLink: ['/purchases-and-supplier/invoice-lists'],
                        visible: this.roleMenuSvr.hideOrShow(["invoice list"]),
                      }
                    ]
                  },
                  {
                    label: 'Payment Request Approval',
                    visible: this.roleMenuSvr.hideOrShow(["payment approval"]),
                    routerLink: ['/purchases-and-supplier/payment-lists'],
                  }
                ]
              },


              {
                label: 'Report',
                visible: this.roleMenuSvr.hideOrShow(["purchase report"]),
                items: [
                  {
                    label: 'Ageing Analysis',
                    icon: '',
                    routerLink: ['/purchases-and-supplier/aging-analysis'],
                  },
                  {
                    label: 'Purchase Report',
                    icon: '',
                    routerLink: ['/purchases-and-supplier/purchase-report']
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        label: 'PPE',
        icon: 'label',
        visible: this.roleMenuSvr.hideOrShow(['ppe']),
        items: [
          {
            label: 'Set Up',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['ppe set up']),
            items: [
              {
                label: 'Asset Classification',
                icon: '',
                routerLink: ['/ppe/asset-classification-list'],
                visible: this.roleMenuSvr.hideOrShow(['asset classification']),
              }
            ]
          },
          {
            label: 'Addition',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['addition']),
            items: [
              {
                label: 'Addition',
                icon: '',
                routerLink: ['/ppe/addition-list']
              },
              {
                label: 'Addition Approvals',
                icon: '',
                routerLink: ['/ppe/addition-approvals'],
                visible: this.roleMenuSvr.hideOrShow(['addition appraisal']),
              },

            ]
          },
          {
            label: 'Register',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['register']),
            routerLink: ['/ppe/register-list']
          },
          {
            label: 'Reassessment',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['reassessment']),
            items: [
              {
                label: 'Reassessment',
                icon: '',
                routerLink: ['/ppe/reassessment-list']
              },
              {
                label: 'Reassessment Appraisals',
                icon: '',
                routerLink: ['/ppe/reassessment-appraisals'],
                visible: this.roleMenuSvr.hideOrShow(['reassessment appraisal']),
              }
            ],

          },
          {
            label: 'Revaluation',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['revaluation']),
            items: [
              {
                label: 'Revaluation',
                icon: '',
                routerLink: ['/ppe/reevaluation-list']
              },
              {
                label: 'Revaluation Appraisal',
                icon: '',
                routerLink: ['/ppe/reevaluation-appraisals'],
                visible: this.roleMenuSvr.hideOrShow(['revaluation appraisal']),
              }
            ]
          },
          {
            label: 'Disposal/Derecognition',
            icon: 'label',
            visible: this.roleMenuSvr.hideOrShow(['disposal']),
            items: [
              {
                label: 'Disposals',
                icon: '',
                routerLink: ['/ppe/disposal-list']
              },
              {
                label: 'Disposal Appraisal',
                icon: '',
                routerLink: ['/ppe/disposal-appraisal'],
                visible: this.roleMenuSvr.hideOrShow(['disposal approval']),
              }
            ]
          }
        ]
      },


      // {
      //   label: "Customer",
      //   icon: "contacts",
      //   visible: this.roleMenuSvr.hideOrShow(["customer information"]),
      //   items: [
      //     {
      //       label: "Customer Information",
      //       icon: "",
      //       routerLink: ["/customer/customer-list"],
      //       visible: this.roleMenuSvr.hideOrShow(["customer information"])
      //     }
      //   ]
      // },

      {
        label: "Finance",
        icon: "content_paste",
        visible: this.roleMenuSvr.hideOrShow(["finance"]),
        items: [
          {
            label: "Setups",
            visible: this.roleMenuSvr.hideOrShow(["finance setup"]),
            items: [
              {
                label: "Statement Type",
                icon: "",
                routerLink: ["/finance/statementtype-list"],
                visible: this.roleMenuSvr.hideOrShow(["statement type"])
              },

              {
                label: "Account Type",
                icon: "",
                routerLink: ["/finance/accounttype-list"],
                visible: this.roleMenuSvr.hideOrShow(["account type"])
              },
              {
                label: "General Ledger",
                icon: "",
                routerLink: ["/finance/gl-list"],
                visible: this.roleMenuSvr.hideOrShow(["general ledger"])
              },
              {
                label: "Sub Ledger",
                icon: "",
                routerLink: ["/finance/subGL-list"],
                visible: this.roleMenuSvr.hideOrShow(["sub ledger"])
              },
              {
                label: 'Bank Setup',
                icon: '',
                routerLink: ['/finance/banks'],
                visible: this.roleMenuSvr.hideOrShow(["bank setup"])
              },
              {
                label: "Financial Year",
                icon: "",
                routerLink: ["/finance/financial-year-list"],
                visible: this.roleMenuSvr.hideOrShow(["financial year"])
              },
              {
                label: "Registry",
                icon: "",
                routerLink: ["/finance/registry-list"],
                visible: this.roleMenuSvr.hideOrShow(["registry"])
              },
              {
                label: "Translation Set up",
                icon: "",
                routerLink: ["/finance/translation-setup"],
                visible: this.roleMenuSvr.hideOrShow(["translation setu"])
              },
              {
                label: 'End of Day Set up',
                icon: '',
                routerLink: ['/finance/eod-setup']
              }
            ]
          },

          {
            label: "Operations",
            visible: this.roleMenuSvr.hideOrShow(["finance operations"]),
            items: [
              {
                label: "Mapping",
                icon: "",
                routerLink: ["/finance/glmapping-list"],
                visible: this.roleMenuSvr.hideOrShow(["gl mapping"])
              },
              {
                label: "ReMapping",
                icon: "",
                routerLink: ["/finance/glRemap-list"],
                visible: this.roleMenuSvr.hideOrShow(["remapping"])
              },
              {
                label: "Journals",
                icon: "",
                routerLink: ["/finance/addjournals"],
                visible: this.roleMenuSvr.hideOrShow(["journals"])
              },
              {
                label: "Journal Approval List",
                icon: "",
                routerLink: ["/finance/journals-approval"],
                visible: this.roleMenuSvr.hideOrShow(["journal approval"])
              },
              {
                label: "GL Transaction",
                icon: "",
                routerLink: ["/finance/gltransaction-list"],
                visible: this.roleMenuSvr.hideOrShow(["gl transaction"])
              },
              {
                label: "Trial Balance",
                icon: "",
                routerLink: ["/finance/trialBalance-list"],
                visible: this.roleMenuSvr.hideOrShow(["trial balance"])
              },
              {
                label: 'Flutterwave Key Setup',
                icon: '',
                routerLink: ['/finance/key-setup']
              },
              {
                label: "Flutterwave Transers",
                icon: "",
                routerLink: ["/finance/flutterwave-transfer"],
                visible: this.roleMenuSvr.hideOrShow(["payments and receipts"])
              },
              {
                label: "Reports",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["finance report"]),
                items: [
                  {
                    label: "Statement of Financial Position",
                    icon: "",
                    routerLink: ["/finance/fs-report"],
                    visible: this.roleMenuSvr.hideOrShow(["financial position"])
                  },
                  {
                    label: "Statement of Profit&Loss",
                    icon: "",
                    routerLink: ["/finance/pl-report"],
                    visible: this.roleMenuSvr.hideOrShow(["profit & loss"])
                  },
                  {
                    label: "Statement of Changes in Equities",
                    icon: "",
                    routerLink: ["/finance/soce-report"],
                    visible: this.roleMenuSvr.hideOrShow(["changes in equities"])
                  },
                  {
                    label: "Excel Report",
                    icon: "",
                    routerLink: ["/finance/excel-report"],
                    visible: this.roleMenuSvr.hideOrShow(["excel report"])
                  }
                ]
              }
            ]
          }

          //                     {
          //                         label: "Reports",
          //                         visible: this.roleMenuSvr.hideOrShow([
          //                             "finance"
          //                         ]),
          //                         items: [
          //                             // {
          //                             //     label: "UnMapping",
          //                             //     icon: "",
          //                             //     routerLink: ["/finance/glmapping-list"],
          //                             //     visible: this.roleMenuSvr.hideOrShow([
          //                             //         "finance"
          //                             //     ])
          //                             // },
          //                             // {
          //                             //     label: "ReMapping",
          //                             //     icon: "",
          //                             //     routerLink: ["/finance/glRemap-list"],
          //                             //     visible: this.roleMenuSvr.hideOrShow([
          //                             //         "finance"
          //                             //     ])
          //                             // }
          //                         ]
          //                     },

          //                     {
          //                         label: "Account Type",
          //                         icon: "",
          //                         routerLink: ["/finance/accounttype-list"],
          //                         visible: this.roleMenuSvr.hideOrShow([
          //                             "finance"
          //                         ])
          //                     }
          // ,
          //                     {
          //                         label: "GL Mapping",
          //                         visible: this.roleMenuSvr.hideOrShow([
          //                             "finance"
          //                         ]),
          //                         items: [
          //                             {
          //                                 label: "UnMapping",
          //                                 icon: "",
          //                                 routerLink: ["/finance/glmapping-list"],
          //                                 visible: this.roleMenuSvr.hideOrShow([
          //                                     "finance"
          //                                 ])
          //                             },
          //                             {
          //                                 label: "ReMapping",
          //                                 icon: "",
          //                                 routerLink: ["/finance/glRemap-list"],
          //                                 visible: this.roleMenuSvr.hideOrShow([
          //                                     "finance"
          //                                 ])
          //                             }
          //                         ]
          //                     },
          //                     {
          //                         label: "Trial Balance",
          //                         icon: "",
          //                         routerLink: ["/finance/trialBalance-list"],
          //                         visible: this.roleMenuSvr.hideOrShow([
          //                             "finance"
          //                         ])
          //                     }
        ]
      },
      //DEPOSITS
      {
        label: "Deposit",
        icon: "grid_on",
        visible: this.roleMenuSvr.hideOrShow(["credit"]),
        items: [
          {
            label: "Setup",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["credit"]),
            items: [
              {
                label: "Deposit Account Setup",
                icon: "",
                routerLink: ["/deposit/accountsetup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Account Type Setup",
                icon: "",
                routerLink: ["/deposit/accounttype-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Category Setup",
                icon: "",
                routerLink: ["/deposit/category-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Business Category Setup",
                icon: "",
                routerLink: ["/deposit/businesscategory-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Transaction Tax Setup",
                icon: "",
                routerLink: ["/deposit/transactiontax-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Transaction Charge Setup",
                icon: "",
                routerLink: ["/deposit/transactioncharge-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Change of Rate Setup",
                icon: "",
                routerLink: ["/deposit/changeofrate-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              // {
              //     label: "Change of Rate Setup",
              //     icon: "",
              //     routerLink: ["/deposit/changeofrate"],
              //     visible: this.roleMenuSvr.hideOrShow([
              //         "credit"
              //     ])
              // },
              {
                label: "Account Closure Setup",
                icon: "",
                routerLink: ["/deposit/bankclosure-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"]),
              },
              {
                label: "Account Activation Setup",
                icon: "",
                routerLink: ["/deposit/account-activation-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Withdrawal Setup",
                icon: "",
                routerLink: ["/deposit/withdrawal-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Transfer Setup",
                icon: "",
                routerLink: ["/deposit/transfer-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Cashier/Teller Setup",
                icon: "",
                routerLink: ["/deposit/callover-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: 'Till and Vault Setup',
                icon: '',
                routerLink: ["/deposit/till-vault-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: 'Transaction Correction',
                icon: '',
                routerLink: ["/deposit/transaction-correction-setup-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
            ]
          },
          {
            label: 'Operations',
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["credit"]),
            items: [
              {
                label: "Customer Account Opening",
                icon: "",
                routerLink: ["/deposit/accountopening-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Change of Rate",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["credit"]),
                items: [
                  {
                    label: "Change of Rate Form",
                    icon: "",
                    routerLink: ["/deposit/changeofrateform-list"],
                    visible: this.roleMenuSvr.hideOrShow(["credit"])
                  },
                  {
                    label: "Change of Rate Approval",
                    icon: "",
                    routerLink: ["/deposit/change-of-rates-approval"],
                    visible: this.roleMenuSvr.hideOrShow(["credit"])
                  }
                ]
              },

              {
                label: "Closure of Bank Account",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["credit"]),
                items: [
                  {
                    label: "Closure of Bank Account Form",
                    icon: "",
                    routerLink: ["/deposit/accountclosure"],
                    visible: this.roleMenuSvr.hideOrShow(["credit"])
                  },
                  {
                    label: "Closure of Bank Account Approval",
                    icon: "",
                    routerLink: ["/deposit/closure-of-bank-account-approval"],
                    visible: this.roleMenuSvr.hideOrShow(["credit"])
                  }
                ]
              },
              {
                label: "Customer Account",
                icon: "",
                routerLink: ["/casa/customeraccount-info-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Customer Transaction",
                icon: "",
                routerLink: ["/casa/customertransaction-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },

              {
                label: "Customer Deposit Form",
                icon: "",
                routerLink: ["/deposit/depositform-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Account Reactivation Form",
                icon: "",
                routerLink: ["/deposit/accountreactivation"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Account Withdrawal Form",
                icon: "",
                routerLink: ["/deposit/withdrawalform"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Transfer Form",
                icon: "",
                routerLink: ["/deposit/transferform"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Cashier/Teller Balancing ",
                icon: "",
                routerLink: ["/deposit/callover"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Correction of Transaction Form",
                icon: "",
                routerLink: ["/deposit/transactioncorrection-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              },
              {
                label: "Till and Vault",
                icon: "",
                routerLink: ["/deposit/till-vault-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit"])
              }
            ]
          }

        ]
      },


      //CREDIT
      {
        label: "Credit",
        icon: "list",
        visible: this.roleMenuSvr.hideOrShow(["credit"]),
        items: [
          {
            label: "Setup",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["credit setup"]),
            items: [
              {
                label: "Fee Setup",
                icon: "",
                routerLink: ["/credit/fee-list"],
                visible: this.roleMenuSvr.hideOrShow(["fee setup"])
              },
              {
                label: "Credit Bureau",
                icon: "",
                routerLink: ["/credit/credit-bureau-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit bureau"])
              },
              {
                label: "Operating Account Set up",
                icon: "",
                routerLink: ["/credit/operating-account"],
                visible: this.roleMenuSvr.hideOrShow(["operating account setup"])
              },
              {
                label: "Loan Staging Setup",
                icon: "",
                routerLink: ["/credit/loan-staging"],
                visible: this.roleMenuSvr.hideOrShow(["loan staging"])
              },
              {
                label: "Credit Classification Setup",
                icon: "",
                routerLink: ["/credit/credit-classification"],
                visible: this.roleMenuSvr.hideOrShow(["credit classification"])
              },
              {
                label: "Exposure Setup",
                icon: "",
                routerLink: ["/credit/exposure-list"],
                visible: this.roleMenuSvr.hideOrShow(["exposure setup"])
              },
              {
                label: "Product Type Setup",
                icon: "",
                routerLink: ["/credit/product-type-list"],
                visible: this.roleMenuSvr.hideOrShow(["product type setup"])
              },

              {
                label: "Product Setup",
                icon: "",
                routerLink: ["/credit/product-list"],
                visible: this.roleMenuSvr.hideOrShow(["product setup"])
              },
              {
                label: "Credit Risk Category Setup",
                icon: "",
                routerLink: ["/credit/category-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit risk category setup"])
              },
              {
                label: "Credit Risk Attribute Setup",
                icon: "",
                routerLink: ["/credit/attribute-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit risk attribute setup"])
              },

              {
                label: "Credit Risk Rating PD Setup",
                icon: "",
                routerLink: ["/credit/credit-risk-rating-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit rating pd setup"])
              },
              {
                label: "Credit Risk Rating Setup",
                icon: "",
                routerLink: ["/credit/credit-risk-rating-pd-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit risk rating set up"])
              },
              {
                label: "Credit Score Card Setup",
                icon: "",
                routerLink: ["/credit/creditriskscorecard-list"],
                visible: this.roleMenuSvr.hideOrShow(["credit score card setup"])
              },

              {
                label: "Customer FS Setup",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["customer fs setup"]),
                items: [
                  {
                    label: "Customer FS Caption Group",
                    icon: "",
                    routerLink: ["/credit/loan-customer-fscaption-group-list"],
                    visible: this.roleMenuSvr.hideOrShow(["customer fs setup"])
                  },
                  {
                    label: "Customer FS Caption",
                    icon: "",
                    routerLink: ["/credit/loan-customer-fscaption-list"],
                    visible: this.roleMenuSvr.hideOrShow(["customer fs setup"])
                  },
                  {
                    label: "Customer FS Ratio Detail",
                    icon: "",
                    routerLink: [
                      "/credit/loan-customer-fscaption-ratio-detail-list"
                    ],
                    visible: this.roleMenuSvr.hideOrShow(["customer fs setup"])
                  }
                ]
              },
              {
                label: "Collateral Setup",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["collateral setup"]),
                items: [
                  {
                    label: "Collateral Type Setup",
                    icon: "",
                    routerLink: ["/credit/collateral-type-list"],
                    visible: this.roleMenuSvr.hideOrShow(["collateral setup"])
                  }
                ]
              },
            ]
          },
          {
            label: "Loan Origination",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["loan origination"]),
            items: [
              {
                label: "Customer",
                icon: "",
                routerLink: ["/credit/loancustomer-list"],
                visible: this.roleMenuSvr.hideOrShow(["loan customer"])
              },
              {
                label: "Start Loan Application",
                icon: "",
                routerLink: ["/credit/startloanapplication-list"],
                visible: this.roleMenuSvr.hideOrShow(["start loan application"])
              },
              {
                label: "Pending Applications",
                routerLink: ["/credit/loanapplications"],
                visible: this.roleMenuSvr.hideOrShow(["pending applications"])
              },
              {
                label: "Loan Application List",
                icon: "",
                routerLink: ["/credit/application-list"],
                visible: this.roleMenuSvr.hideOrShow(["loan application list"])
              },
              {
                label: "Credit Appraisal",
                icon: "",
                routerLink: ["/credit/credit-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["credit appraisal"])
              },
              {
                label: "Loan Schedule",
                icon: "",
                routerLink: ["/credit/schedule"],
                visible: this.roleMenuSvr.hideOrShow(["loan schedule"])
              },

              {
                label: "Offer Letter Generation",
                icon: "",
                routerLink: ["/credit/offerletter-list"],
                visible: this.roleMenuSvr.hideOrShow([
                  "offer letter generation"
                ])
              },
              {
                label: "Offer Letter Review",
                icon: "",
                routerLink: ["/credit/offerletterreview"],
                visible: this.roleMenuSvr.hideOrShow(["offer letter review"])
              },
              {
                label: "Loan Booking",
                icon: "",
                routerLink: ["/credit/loan-booking"],
                visible: this.roleMenuSvr.hideOrShow(["loan booking"])
              },
              {
                label: "Loan Booking Approval",
                icon: "",
                routerLink: ["/credit/loan-booking-approval"],
                visible: this.roleMenuSvr.hideOrShow(["loan booking"])
              },
              {
                label: "IFRS",
                icon: "",
                visible: this.roleMenuSvr.hideOrShow(["ifrs"]),
                items: [
                  {
                    label: "IFRS Setup Data",
                    icon: "",
                    routerLink: ["/credit/setup-data-list"],
                    visible: this.roleMenuSvr.hideOrShow(["ifrs data setup"])
                  },
                  {
                    label: "IFRS Scenario Setup Data",
                    icon: "",
                    routerLink: ["/credit/scenario-setup-data-list"],
                    visible: this.roleMenuSvr.hideOrShow(["scenario setup"])
                  },
                  {
                    label: "Macro Economic Variable ",
                    icon: "",
                    routerLink: ["/credit/macro-economic-variable-list"],
                    visible: this.roleMenuSvr.hideOrShow(["macro-economic variables"])
                  },
                  {
                    label: "Historical Information For PD",
                    icon: "",
                    routerLink: ["/credit/loan-application-score-card-history"],
                    visible: this.roleMenuSvr.hideOrShow(["historical pd"])
                  },
                  {
                    label: "Historical Information For LGD",
                    icon: "",
                    routerLink: ["/credit/loan-lgd-history"],
                    visible: this.roleMenuSvr.hideOrShow(["historical lgd"])
                  },
                  {
                    label: "Run Impairments",
                    icon: "",
                    routerLink: ["/credit/run-impairments"],
                    visible: this.roleMenuSvr.hideOrShow(["run impairment"])
                  }
                ]
              }
            ]
          },
          {
            label: "Loan Management",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["loan management"]),
            items: [
              {
                label: "Loan Review Application",
                icon: "",
                routerLink: ["/loan-management/application"],
                visible: this.roleMenuSvr.hideOrShow(["loan review application"])
              },
              {
                label: "Loan Review Appraisal",
                icon: "",
                routerLink: ["/loan-management/appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["loan review appraisal"])
              },
              {
                label: "Loan Review Offer Letter",
                icon: "",
                routerLink: ["/loan-management/offer-letter"],
                visible: this.roleMenuSvr.hideOrShow(["loan review offer letter"])
              },
              {
                label: "Loan Review Operation",
                icon: "",
                routerLink: ["/credit/loanreviewoperations-list"],
                visible: this.roleMenuSvr.hideOrShow(["loan review operation"])
              },
              // {
              //   label: "Loan  Prepayment",
              //   icon: "",
              //   routerLink: ["/loan-management/loan-prepayment"],
              //   visible: this.roleMenuSvr.hideOrShow(["Loan Review Operation"])
              // },
              {
                label: "Collateral Management",
                icon: "",
                routerLink: ["/loan-management/collateral"],
                visible: this.roleMenuSvr.hideOrShow(["collateral management"])
              },
              {
                label: "Customer Transaction",
                icon: "",
                routerLink: ["/loan-management/customertransaction-list"],
                visible: this.roleMenuSvr.hideOrShow(["customer transaction"])
              },
              {
                label: "Loan Repayment",
                icon: "",
                routerLink: ["/loan-management/loan-repayment"],
                visible: this.roleMenuSvr.hideOrShow(["loan repayment"])
              },
              {
                label: "Payment Due Loans",
                icon: "",
                routerLink: ["/loan-management/payments-due"],
                visible: this.roleMenuSvr.hideOrShow(["payment due loans"])
              },
              {
                label: "Overdue",
                icon: "",
                routerLink: ["/loan-management/overdue"],
                visible: this.roleMenuSvr.hideOrShow(["overdues"])
              }
            ]
          },
          {
            label: "Reports",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["credit reports"]),
            items: [
              {
                label: "Customer Reports",
                icon: "",
                routerLink: ["/reports/customer-report"],
                visible: this.roleMenuSvr.hideOrShow(["customer reports"])
              },
              {
                label: "Loan Reports",
                icon: "",
                routerLink: ["/reports/loan-report"],
                visible: this.roleMenuSvr.hideOrShow(["loan reports"])
              },
              {
                label: "Summary Reports",
                icon: "",
                routerLink: ["/reports/summary-report"],
                visible: this.roleMenuSvr.hideOrShow(["summary reports"])
              }
            ]
          }
        ]
      },

      //INVESTMENT FUNDS
      {
        label: "Investment Fund",
        icon: "list",
        visible: this.roleMenuSvr.hideOrShow(["investment fund"]),
        items: [
          {
            label: "Dashboard",
            icon: "",
            routerLink: ["/investor/dashboard"],
            visible: this.roleMenuSvr.hideOrShow(["investment fund dashboard"])
          },
          {
            label: "Setup",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["investment fund setup"]),
            items: [
              {
                label: "Product Type Setup",
                icon: "",
                routerLink: ["/investor/product-type"],
                visible: this.roleMenuSvr.hideOrShow(["product type setup"])
              },
              {
                label: "Product Setup",
                icon: "",
                routerLink: ["/investor/product-list"],
                visible: this.roleMenuSvr.hideOrShow(["product setup"])
              }
            ]
          },
          {
            label: "Investment Operation",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["investment fund operation"]),
            items: [
              {
                label: "Customer",
                icon: "",
                routerLink: ["/investor/investor-customer-list"],
                visible: this.roleMenuSvr.hideOrShow(["customer"])
              },
              {
                label: 'Pending Investments',
                icon: "",
                routerLink: ["/investor/pending-investments"],
                visible: this.roleMenuSvr.hideOrShow(["pending investments"])
              },
              {
                label: "Investments List",
                icon: "",
                routerLink: ["/investor/investments-list"],
                visible: this.roleMenuSvr.hideOrShow(["investment list"])
              },
              {
                label: "Investment Appraisal",
                icon: "",
                routerLink: ["/investor/investment-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["investment appraisal"])
              },
              {
                label: "Pending Collections",
                icon: "",
                routerLink: ['/investor/pending-collections'],
                visible: this.roleMenuSvr.hideOrShow(["pending collections"])
              },
              {
                label: "Pending Rollover",
                icon: "",
                routerLink: ['/investor/pending-rollover'],
                visible: this.roleMenuSvr.hideOrShow(["investment"])
              },
              {
                label: "Pending TopUp",
                icon: "",
                routerLink: ['/investor/pending-topup'],
                visible: this.roleMenuSvr.hideOrShow(["pending rollover"])
              },
              {
                label: "Collection Appraisal",
                icon: "",
                routerLink: ["/investor/collection-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["collection appraisal"])
              },
              {
                label: "Pending Liquidations",
                icon: "",
                routerLink: ['/investor/pending-liquidations'],
                visible: this.roleMenuSvr.hideOrShow(["pending liquidations"])
              },
              {
                label: "Liquidation Appraisal",
                icon: "",
                routerLink: ["/investor/liquidation-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["liquidation appraisal"])
              },
              {
                label: "Placement Certificate Generation",
                icon: "",
                routerLink: ["/investor/placement-certificate-list"],
                visible: this.roleMenuSvr.hideOrShow(["placement certificate"])
              }
            ]
          },
          {
            label: "Reports",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["investment fund reports"]),
            items: [
              {
                label: "Customer Report",
                icon: "",
                routerLink: ["/reports/investor-report"],
                visible: this.roleMenuSvr.hideOrShow(["investment fund reports"])
              },
              {
                label: "Investment Report",
                icon: "",
                routerLink: ["/reports/investment-report"],
                visible: this.roleMenuSvr.hideOrShow(["investment fund reports"])
              }
            ]
          }
        ]
      },
      //TREASURE
      {
        label: "Treasury",
        icon: "list",
        visible: this.roleMenuSvr.hideOrShow(["treasury"]),
        items: [
          {
            label: "Setup",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["credit setup"]),
            items: [
              {
                label: "Product Type Setup",
                icon: "",
                routerLink: ["/treasury/product-type"],
                visible: this.roleMenuSvr.hideOrShow(["product type setup"])
              },
              {
                label: "Product Setup",
                icon: "",
                routerLink: ["/treasury/product-list"],
                visible: this.roleMenuSvr.hideOrShow(["product setup"])
              }
            ]
          },
          {
            label: "Treasury Origination",
            icon: "",
            visible: this.roleMenuSvr.hideOrShow(["treasury origination"]),
            items: [
              {
                label: "Issuer Registration",
                icon: "",
                routerLink: ["/treasury/issuer-list"],
                visible: this.roleMenuSvr.hideOrShow(["issuer registration"])
              },
              {
                label: "Investments List",
                icon: "",
                routerLink: ["/treasury/investments-list"],
                visible: this.roleMenuSvr.hideOrShow(["tre investment list"])
              },
              {
                label: "Investment Appraisal",
                icon: "",
                routerLink: ["/treasury/investment-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["tre investment appraisal"])
              },
              {
                label: "Collection Appraisal",
                icon: "",
                routerLink: ["/treasury/collection-appraisal"],
                // visible: this.roleMenuSvr.hideOrShow(["tre collection appraisal"])
              },
              {
                label: "Liquidation Appraisal",
                icon: "",
                routerLink: ["/treasury/liquidation-appraisal"],
                visible: this.roleMenuSvr.hideOrShow(["tre liquidation appraisal"])
              },
              {
                label: "Placement Certificate Generation",
                icon: "",
                routerLink: ["/treasury/placement-certificate-list"],
                visible: this.roleMenuSvr.hideOrShow([
                  "tre placement certificate"
                ])
              }
            ]
          }
        ]
      }
    ];
  }

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>(
      document.getElementById("theme-css")
    );
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>(
      document.getElementById("layout-css")
    );

    themeLink.href = "assets/theme/theme-" + theme + ".css";
    layoutLink.href = "assets/layout/css/layout-" + theme + ".css";
  }
}

@Component({
  /* tslint:disable:component-selector */
  selector: "[app-submenu]",
  /* tslint:enable:component-selector */
  template: `
      <ng-template
              ngFor
              let-child
              let-i="index"
              [ngForOf]="root ? item : item.items"
      >
          <li
                  [ngClass]="{ 'active-menuitem': isActive(i) }"
                  [class]="child.badgeStyleClass"
                  *ngIf="child.visible === false ? false : true"
          >
              <a
                      [href]="child.url || '#'"
                      (click)="itemClick($event, child, i)"
                      (mouseenter)="onMouseEnter(i)"
                      class="ripplelink"
                      *ngIf="!child.routerLink"
                      [attr.tabindex]="!visible ? '-1' : null"
                      [attr.target]="child.target"
              >
                  <i *ngIf="child.icon" class="material-icons">{{ child.icon }}</i>
                  <span>{{ child.label }}</span>
                  <span class="menuitem-badge" *ngIf="child.badge">{{
                      child.badge
                      }}</span>
                  <i class="material-icons submenu-icon" *ngIf="child.items"
                  >keyboard_arrow_down</i
                  >
              </a>

              <a
                      (click)="itemClick($event, child, i)"
                      (mouseenter)="onMouseEnter(i)"
                      class="ripplelink"
                      *ngIf="child.routerLink"
                      [routerLink]="child.routerLink"
                      routerLinkActive="active-menuitem-routerlink"
                      [routerLinkActiveOptions]="{ exact: true }"
                      [attr.tabindex]="!visible ? '-1' : null"
                      [attr.target]="child.target"
              >
                  <i *ngIf="child.icon" class="material-icons">{{ child.icon }}</i>
                  <span>{{ child.label }}</span>
                  <span class="menuitem-badge" *ngIf="child.badge">{{
                      child.badge
                      }}</span>
                  <i class="material-icons submenu-icon" *ngIf="child.items"
                  >keyboard_arrow_down</i
                  >
              </a>
              <div class="layout-menu-tooltip">
                  <div class="layout-menu-tooltip-arrow"></div>
                  <div class="layout-menu-tooltip-text">
                      {{ child.label }}
                  </div>
              </div>
              <ul
                      app-submenu
                      [item]="child"
                      *ngIf="child.items"
                      [visible]="isActive(i)"
                      [reset]="reset"
                      [parentActive]="isActive(i)"
                      [@children]="
            (app.isSlim() || app.isHorizontal()) && root
              ? isActive(i)
                ? 'visible'
                : 'hidden'
              : isActive(i)
              ? 'visibleAnimated'
              : 'hiddenAnimated'
          "
              ></ul>
          </li>
      </ng-template>
  `,
  animations: [
    trigger("children", [
      state(
        "hiddenAnimated",
        style({
          height: "0px"
        })
      ),
      state(
        "visibleAnimated",
        style({
          height: "*"
        })
      ),
      state(
        "visible",
        style({
          height: "*",
          "z-index": 100
        })
      ),
      state(
        "hidden",
        style({
          height: "0px",
          "z-index": "*"
        })
      ),
      transition(
        "visibleAnimated => hiddenAnimated",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      ),
      transition(
        "hiddenAnimated => visibleAnimated",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      )
    ])
  ]
})
export class AppSubMenuComponent {
  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  constructor(public app: AllModulesComponent) { }

  itemClick(event: Event, item: MenuItem, index: number) {
    if (this.root) {
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = this.activeIndex === index ? null : index;

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        // this.app.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      if (this.app.isHorizontal() || this.app.isSlim()) {
        this.app.resetMenu = true;
      } else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
      this.app.menuHoverActive = !this.app.menuHoverActive;
    }
  }

  onMouseEnter(index: number) {
    if (
      this.root &&
      this.app.menuHoverActive &&
      (this.app.isHorizontal() || this.app.isSlim()) &&
      !this.app.isMobile() &&
      !this.app.isTablet()
    ) {
      this.activeIndex = index;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && (this.app.isHorizontal() || this.app.isSlim())) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }
}
