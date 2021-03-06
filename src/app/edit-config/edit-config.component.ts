import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from '../services/config.service';
import {Config} from '../model/config.model';

declare var $: any;

@Component({
    selector: 'app-edit-config',
    templateUrl: './edit-config.component.html',
    styleUrls: ['./edit-config.component.scss']
})
export class EditConfigComponent implements OnInit {

    host: Config = new Config();
    pathFormat: Config = new Config();
    contactEmail: Config = new Config();

    constructor(public router: Router, public configService: ConfigService) {
    }

    ngOnInit() {

        this.configService.getConfig('host')
            .subscribe(
                data => {
                    this.host = data;
                }
            )
        ;
        this.configService.getConfig('pathFormat')
            .subscribe(
                data => {
                    this.pathFormat = data;
                }
            )
        ;
        this.configService.getConfig('contactEmail')
            .subscribe(
                data => {
                    this.contactEmail = data;
                }
            )
        ;
    }

    onEditConfig(dataForm) {
        (<HTMLInputElement> document.getElementById('pathFormatSubmit')).disabled = true;
        (<HTMLInputElement> document.getElementById('hostSubmit')).disabled = true;
        (<HTMLInputElement> document.getElementById('contactEmailSubmit')).disabled = true;
        this.configService.editConfig(dataForm)
            .subscribe(
                data => {
                    this.showNotification('bottom', 'right', 1, 'La configuration a été modifié avec succès.');
                    (<HTMLInputElement> document.getElementById('pathFormatSubmit')).disabled = false;
                    (<HTMLInputElement> document.getElementById('hostSubmit')).disabled = false;
                    (<HTMLInputElement> document.getElementById('contactEmailSubmit')).disabled = false;
                },
                err => {
                    (<HTMLInputElement> document.getElementById('pathFormatSubmit')).disabled = false;
                    (<HTMLInputElement> document.getElementById('hostSubmit')).disabled = false;
                    (<HTMLInputElement> document.getElementById('contactEmailSubmit')).disabled = false;
                    if (err.error.hasOwnProperty('result')) {
                        this.showNotification('bottom', 'right', 0, err.error.result);
                    } else if (err.error.hasOwnProperty('error')) {
                        this.showNotification('bottom', 'right', 0, err.error.error);
                    } else {
                        console.log(err);
                        this.showNotification('bottom', 'right', 0, 'erreur.');
                    }
                }
            )
        ;
    }

    showNotification(from, align, color, message) {
        const type = ['danger', 'success'];
        const icon = ['error_outline', 'check'];

        $.notify(
            {
                message: message
            },
            {
                type: type[color], // {0}
                delay: 2000,
                placement: {
                    from: from,
                    align: align
                },
                template:
                    '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                    '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">' +
                    '<i class="material-icons">close</i>' +
                    '</button>' +
                    '<i class="material-icons" data-notify="icon">' + icon[color] + '</i> ' +
                    '<span data-notify="message">{2}</span>' +
                    '</div>'
            }
        );
    }

}
