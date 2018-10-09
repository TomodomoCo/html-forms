<?php defined( 'ABSPATH' ) or exit;

$tabs = array(
    'fields'        => __( 'Fields', 'html-forms' ),
    'messages'      => __( 'Messages', 'html-forms' ),
    'settings'      => __( 'Settings', 'html-forms' ),
    'actions'       => __( 'Actions', 'html-forms' ),
);

if( $form->settings['save_submissions'] ) {
    $tabs['submissions'] = __( 'Submissions', 'html-forms' );
}

?>
<script>document.title = 'Edit form' + ' - ' + document.title;</script>
<div class="wrap hf">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Edit form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Edit form', 'html-forms' ); ?></h1>

    <?php if ( ! empty( $_GET['saved'] ) ) {
        echo '<div class="notice notice-success"><p>' . __( 'Form updated.', 'html-forms' ) . '</p></div>';
    } ?>

    <form method="post">
        <input type="hidden" name="_hf_admin_action" value="save_form" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $form->ID ); ?>" />
        <input type="submit" style="display: none; " />

        <div id="titlediv" class="hf-form-meta">
            <div id="titlewrap" class="hf-tiny-margin">
                <label class="hf-form-meta-label" for="title"><?php _e( 'Form title', 'html-forms' ); ?></label>
                <input type="text" name="form[title]" size="30" value="<?php echo esc_attr( $form->title ); ?>" id="title" spellcheck="true" autocomplete="off" placeholder="<?php echo __( "Enter the title of your form", 'html-forms' ); ?>" style="line-height: initial;" >
            </div>
            <div class="inside hf-form-meta-row">
                <div class="hf-tiny-margin hf-form-meta-section hide-if-no-js">
                    <label class="hf-form-meta-label" for="form-slug-input"><?php _e('Form slug'); ?></label>
                    <input type="text" id="form-slug-input" name="form[slug]" value="<?php echo esc_attr( $form->slug ); ?>" readonly /> &lrm;<button type="button" class="button button-small" onclick="document.getElementById('form-slug-input').removeAttribute('readonly');" aria-label="<?php _e( 'Edit slug', 'html-forms' ); ?>"><?php _e( 'Edit', 'html-forms' ); ?></button>
                </div>
                <div class="hf-tiny-margin hf-form-meta-section">
                    <label class="hf-form-meta-label" for="shortcode"><?php _e( 'Copy this shortcode and paste it into your post, page, or text widget content', 'html-forms' ); ?></label>
                    <input id="shortcode" type="text" class="regular-text" value="<?php echo esc_attr( sprintf( '[hf_form slug="%s"]', $form->slug ) ); ?>" readonly onclick="this.select()">
                </div>
            </div>
        </div>

        <div class="hf-small-margin">
            <h2 class="nav-tab-wrapper" id="hf-tabs-nav">
                <?php foreach( $tabs as $tab => $name ) {
                    $class = ( $active_tab === $tab ) ? 'nav-tab-active' : '';
                    echo sprintf( '<a class="nav-tab nav-tab-%s %s" data-tab-target="%s" href="%s">%s</a>', $tab, $class, $tab, $this->get_tab_url( $tab ), $name );
                } ?>
            </h2>

            <div id="tabs">
                <?php
                // output each tab
                foreach( $tabs as $tab => $name ) {
                    $class = ($active_tab === $tab) ? 'hf-tab-active' : '';
                    echo sprintf('<div class="hf-tab %s" id="tab-%s" data-tab="%s">', $class, $tab, $tab);
                    do_action( 'hf_admin_output_form_tab_' . $tab, $form );
                    echo '</div>';
                } // end foreach tab
                ?>

            </div><!-- / tabs -->
        </div>

    </form>

    <?php require __DIR__ . '/admin-footer.php'; ?>
</div>
