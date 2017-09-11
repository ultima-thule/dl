__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime

sum_in_progress = 0
sum_total = 0

def _initMongoConn ():
    connect('leankit')

def _initSponsorsDict ():
    spons_dict = {}
    sponsors = lib.mongoLeankit.Sponsor.objects()
    for i in sponsors:
        spons_dict[i.tag] = i.name + " (" + i.bo_name + ")"
    return spons_dict

def _initReportParams():
    keys = ['report_budget_tolerance', 'report_date_tolerance', 'report_base_rate']

    params_dict = {}
    for i in keys:
        params_dict[i] = 0

    configparams = lib.mongoLeankit.Configparam.objects()
    for i in configparams:
        if i.param_key in keys:
            params_dict[i.param_key] = i.param_value_string

    return params_dict


def writeCollection(collection, excelReport):
    global sum_in_progress
    global sum_total

    last_sponsor = "Not defined"
    sponsor_sum_in_progress = 0
    sponsor_sum_total = 0

    if len(collection) > 0:
        for index, card in enumerate(collection):
            if card.extended_data.sponsor_name != last_sponsor:
                if index != 0:
                    excelReport.writeSummary(sponsor_sum_in_progress, sponsor_sum_total, "Total for sponsor")
                last_sponsor = card.extended_data.sponsor_name
                sponsor_sum_in_progress = 0
                sponsor_sum_total = 0
                excelReport.laneBreak()
                excelReport.writeSponsor(last_sponsor)
            excelReport.writeCard(card)
            if card.taskboard_completed_card_size is not None:
                sum_in_progress += card.taskboard_completed_card_size
                sponsor_sum_in_progress += card.taskboard_completed_card_size
            if card.size is not None:
                sum_total += card.size
                sponsor_sum_total += card.size
        excelReport.writeSummary(sponsor_sum_in_progress, sponsor_sum_total, "Total for sponsor")


if __name__ == '__main__':
    sum_in_progress = 0
    sum_total = 0

    _initMongoConn()

    excelReport = lib.excel.ExcelReport(datetime.datetime.now().strftime("Status_%Y-%m-%d-%H-%M-%S.xlsx"),
                         "Portfolio DreamLab")
    excelReport.initReport(_initSponsorsDict (), _initReportParams())


    # write all cards with set up sponsor
    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='ROOT LANE')
                                  & Q(extended_data__sponsor_name__ne ='')
                                  & Q(type_name__ne ='Plan: support')).order_by('extended_data__sponsor_name', 'title')
    writeCollection(cards, excelReport)

    # writa all cards without sponsor
    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='ROOT LANE')
                                  & Q(extended_data__sponsor_name ='')
                                  & Q(type_name__ne ='Plan: support')).order_by('title')
    writeCollection(cards, excelReport)

    excelReport.writeSummary(sum_in_progress, sum_total, "IT Production total")

    data = excelReport.close()

    # print("Report generated, saving to database...")
    report = lib.mongoLeankit.Report()

    report.xls_data = data
    report.generation_date = datetime.datetime.now()
    report.format_type = "1"
    report.is_plan = False

    report.save()
    exit(0)
    # print("done.")
