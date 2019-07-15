import { Component, OnInit, AfterViewInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { DndDragImageOffsetFunction } from "ngx-drag-drop";
import { ApiSrvc } from './api-srvc.service';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { CustomFilterPipe } from './custom-filter.pipe';

interface panelList {
  columns?: any[];
  designBlockTypeGuid: string;
  image: string;
  name: string;
  renderedHtml: string;
}
interface toolPanelObj {
  show?:boolean;
}
interface NestableListItemContainer {}
interface addonListObj {}
interface addonList {}

declare var parentContentGuid: any;
declare var parentRecordGuid: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit { //, AfterViewInit, AfterViewChecked
  title = 'Addon-List-Tool';
  @ViewChild('script') script: ElementRef;

  toolPanel = {
    show: false
  };
  nestableList: panelList[] = [];
  nestableListContainer: NestableListItemContainer[] = []; //array
  addonList: addonList[] = []; //array
  addonListObj = {};

  locationURL = {};

  constructor(private apiSrvc: ApiSrvc) { }

  ngOnInit() {
      this.getPanelList();
      this.getAddonList();
      this.locationURL = this.apiSrvc.apiUrl;
  }

  getPanelList():  void {
      this.apiSrvc.getangular7toolPanelList(parentContentGuid, parentRecordGuid)
      .subscribe((nestableList:any )=> {
        nestableList['addonPanelList'].forEach(obj => {
          obj.instanceGuid = ''
        })
        this.nestableList = nestableList['addonPanelList'];
      });

  }
  getAddonList():  void {
      this.apiSrvc.getangular7toolAddonList(parentContentGuid, parentRecordGuid)
      .subscribe((addonListObj:any) => {
        delete addonListObj['errorList'];
        this.addonList = addonListObj['addonList'];
        this.addonListObj = addonListObj;

      });
  }

  private currentDraggableEvent:DragEvent;
  private currentDragEffectMsg:string;

  onDragStart( event:DragEvent) {
    this.currentDragEffectMsg = "";
    this.currentDraggableEvent = event;
  }

  onDragged( item:any, list:any[], effect:DropEffect ) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;
    if( effect === "move" ) {
      const index = list.indexOf( item );
      list.splice( index, 1 );
    }
  }

  onDragEnd( event:DragEvent) {
    this.currentDraggableEvent = event;
    console.log('drag end');
  }

  onDrop( event:DndDropEvent, list?:any[] ) {
    this.nestableListContainer = list;
    console.log(this.addonList);
    console.log(this.addonListObj);
    // console.log(event);

    if( list
      && (event.dropEffect === "copy"
        || event.dropEffect === "move") ) {

          let item = event.data;
          let isHtmlObj = false;
          let index = event.index;

          if(!item.renderedHtml) {
            item.renderedHtml = '';
          }

          if(item.columns) {
            item.columns.forEach(obj => {
              if(!obj.addonList) {
                obj.addonList = [];
              }

            })
          }
          else {
            isHtmlObj = true;
          }

          if( typeof index === "undefined" ) {
            index = list.length;
          }

          list.splice( index, 0, event.data );

          // Dropping a block onto the page
          // For some reason, when moving a block, there is a delay in updating 'this.addonlistObj' and this causes it to appear as if there are two copies of the record when moving a block.  I get around this by calling the set twice, but need to come up with a better solution
          this.apiSrvc.setangular7toolAddonList(this.addonListObj).subscribe((renderedItem:any) => {
            if(isHtmlObj) {
              item.renderedHtml = renderedItem.renderedHtml;
              console.log(item.renderedHtml);
            }
            //just testing
            // Calling this twice because there is an asyncronous problem - need to change this
            this.apiSrvc.setangular7toolAddonList(this.addonListObj).subscribe((renderedItem:any) => {
            });
          });
    }
    else {
      // Only Deleting Blocks should render here
      var data = {
        "parentContentGuid":parentContentGuid,
        "parentRecordGuid":parentRecordGuid,
        "instanceGuid":event.data.instanceGuid
      }

      // Deleting a block - dropping it into the trash
      // There might be a better way to do this
      this.apiSrvc.deleteangular7toolAddonList(data).subscribe((renderedItem:any) => {
        this.apiSrvc.setangular7toolAddonList(this.addonListObj).subscribe((renderedItem:any) => {
        });
      });
    }
    console.log('on drop');
  }

} //end class AppComponent

export interface Config {
}
